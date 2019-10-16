import {
    Span, CompoundSpan, AttributeName, attributeNames,
    SimpleSpan, AttributedSpan, ImageSpan,
    Image, SpanAttribute, ComplexSpan, ComplexSpanData,
} from '../model';
import { guard, flatten, filterUndefined } from './misc';

export function compoundSpan(spans: Span[]): Span {
    return spans;
}

export function attrSpan(span: Span, attr: AttributeName): Span {
    return {
        [attr]: span,
    } as Span;
}

export function imageSpan(imageData: Image): Span {
    return { image: imageData };
}

export const isSimpleSpan = guard<SimpleSpan>(s => typeof s === 'string');
export const isImageSpan = guard<ImageSpan>(s => s.image !== undefined);
export const isCompoundSpan = guard<CompoundSpan>(s => Array.isArray(s));
export const isComplexSpan = guard<ComplexSpan>(s => s.a !== undefined);

function getSpanAttr(span: AttributedSpan): SpanAttribute | undefined {
    for (const an of attributeNames) {
        if ((span as any)[an] !== undefined) {
            return {
                attr: an,
                span: (span as any)[an],
            };
        }
    }

    return undefined;
}

type SpanMapFn<T> = {
    simple: (span: SimpleSpan) => T,
    attr: (span: Span, attr: AttributeName) => T,
    complex: (span: Span, data: ComplexSpanData) => T,
    image: (image: Image) => T,
    compound: (spans: Span[]) => T,
};
type DefaultSpanHandler<T> = {
    default: (span: Span) => T,
};
export function mapSpan<T>(span: Span, fn: Partial<SpanMapFn<T>> & DefaultSpanHandler<T>): T {
    if (isSimpleSpan(span)) {
        return fn.simple
            ? fn.simple(span)
            : fn.default(span);
    } else if (isCompoundSpan(span)) {
        return fn.compound
            ? fn.compound(span)
            : fn.default(span);
    } else if (isComplexSpan(span)) {
        return fn.complex
            ? fn.complex(span.span, span)
            : fn.default(span);
    } else if (isImageSpan(span)) {
        return fn.image
            ? fn.image(span.image)
            : fn.default(span);
    } else {
        if (fn.attr) {
            const attr = getSpanAttr(span);
            return attr
                ? fn.attr(attr.span, attr.attr)
                : fn.default(span);
        } else {
            return fn.default(span);
        }
    }
}
export function mapSpanFull<T>(span: Span, fn: SpanMapFn<T> & DefaultSpanHandler<T>): T {
    return mapSpan(span, fn);
}

export function visitSpan<T>(span: Span, visitor: (s: Span) => T): T[] {
    const inside = mapSpanFull<T[]>(span, {
        compound: spans => flatten(spans.map(s => visitSpan(s, visitor))),
        attr: (s, attr) => visitSpan(s, visitor),
        complex: s => visitSpan(s, visitor),
        simple: () => [],
        image: () => [],
        default: () => [],
    });
    return [...inside, visitor(span)];
}

export function processSpan(span: Span, fn: (s: Span) => Span): Span {
    const inside = mapSpanFull(span, {
        simple: s => s,
        attr: (s, attr) => attrSpan(processSpan(s, fn), attr),
        image: data => imageSpan(data),
        compound: spans => compoundSpan(spans.map(s => processSpan(s, fn))),
        complex: (s, data) => ({ ...data, span: processSpan(s, fn) }),
        default: s => s,
    });
    return fn(inside);
}

export async function processSpanAsync(span: Span, fn: (s: Span) => Promise<Span>): Promise<Span> {
    const inside = await mapSpanFull(span, {
        simple: async s => s,
        compound: async spans => compoundSpan(await Promise.all(
            spans.map(s => processSpanAsync(s, fn))
        )),
        attr: async (s, attr) => attrSpan(await processSpanAsync(s, fn), attr),
        complex: async (s, data) => ({ ...data, span: await processSpanAsync(s, fn) }),
        image: async data => imageSpan(data),
        default: async s => s,
    });
    return fn(inside);
}

export function extractSpanText(span: Span): string {
    return mapSpanFull(span, {
        simple: s => s,
        attr: extractSpanText,
        image: () => '',
        complex: extractSpanText,
        compound: ss => ss
            .map(extractSpanText)
            .join(''),
        default: () => '',
    });
}

export function normalizeSpan(span: Span): Span {
    if (isSimpleSpan(span)) {
        return span;
    } else if (isCompoundSpan(span)) {
        return normalizeCompoundSpan(span);
    } else if (isComplexSpan(span)) {
        if (Object.keys(span).length === 1) {
            return span.span;
        }
    } else if (isImageSpan(span)) {
        return span;
    } else {
        const attr = getSpanAttr(span);
        if (attr !== undefined) {
            const an = attr.attr;
            return { [an]: normalizeSpan(attr.span) } as Span;
        } else {
            return span;
        }
    }
}

function normalizeCompoundSpan(spans: Span[]): Span {
    const result: Span[] = [];

    let current: SimpleSpan | undefined = undefined;
    for (let idx = 0; idx < spans.length; idx++) {
        const span = normalizeSpan(spans[idx]);
        if (isSimpleSpan(span)) {
            if (current === undefined) {
                current = span;
            } else {
                current += span;
            }
        } else {
            if (current !== undefined) {
                result.push(current);
                current = undefined;
            }
            result.push(span);
        }
    }
    if (current !== undefined) {
        result.push(current);
    }

    return result.length === 0 ? ''
        : result.length === 1 ? result[0]
            : result;
}

export function extractRefsFromSpan(span: Span): string[] {
    const results = visitSpan(span, s => mapSpan(s, {
        complex: (_, data) => data.refToId,
        default: () => undefined,
    }));
    return filterUndefined(results);
}

export function spanLength(span: Span): number {
    return mapSpanFull(span, {
        simple: s => s.length,
        attr: spanLength,
        complex: spanLength,
        compound: ss => ss.reduce((len, s) => len + spanLength(s), 0),
        image: () => 0,
        default: () => 0,
    });
}

export function* iterateSpans(spans: Span[]): Generator<[Span, number]> {
    let offset = 0;
    for (const span of spans) {
        yield [span, 0];
        if (isCompoundSpan(span)) {
            const subs = span;
            for (const [sub, sym] of iterateSpans(subs)) {
                yield [sub, sym + offset];
            }
        }
        offset += spanLength(span);
    }
}

export function findAnchor(spans: Span[], refId: string): number | undefined {
    for (const [s, sym] of iterateSpans(spans)) {
        if (isComplexSpan(s) && s.refId === refId) {
            return sym;
        }
    }
    return undefined;
}

export function isEmptyContentSpan(span: Span): boolean {
    return mapSpanFull(span, {
        simple: s => s ? false : true,
        attr: isEmptyContentSpan,
        complex: isEmptyContentSpan,
        compound: ss => ss.every(isEmptyContentSpan),
        image: () => false,
        default: () => false,
    });
}
