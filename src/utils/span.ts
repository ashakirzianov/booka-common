import {
    Span, CompoundSpan, AttributeName, attributeNames,
    SimpleSpan, RefSpan, SemanticSpan, AttributedSpan, ImageSpan,
    ImageData, SpanAttribute, Semantic, AnchorSpan,
} from '../model';
import { guard, flatten, filterUndefined } from './misc';

export function compoundSpan(spans: Span[]): Span {
    return spans;
}

export function attrSpan(span: Span, attr: AttributeName): Span {
    return {
        [attr]: span,
    };
}

export function refSpan(span: Span, refToId: string): Span {
    return {
        ref: span,
        refToId,
    };
}

export function anchorSpan(span: Span, refId: string): Span {
    return {
        a: span,
        refId,
    };
}

export function semanticSpan(span: Span, semantics: Semantic[]): Span {
    return {
        span: span,
        semantics,
    };
}

export function imageSpan(imageData: ImageData): Span {
    return { image: imageData };
}

export const isSimpleSpan = guard<SimpleSpan>(s => typeof s === 'string');
export const isCompoundSpan = guard<CompoundSpan>(s => Array.isArray(s));
export const isRefSpan = guard<RefSpan>(s => s.ref !== undefined);
export const isAnchorSpan = guard<AnchorSpan>(s => s.a !== undefined);
export const isSemanticSpan = guard<SemanticSpan>(s => s.span !== undefined);
export const isImageSpan = guard<ImageSpan>(s => s.image !== undefined);

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
    compound: (spans: Span[]) => T,
    attr: (span: Span, attr: AttributeName) => T,
    ref: (span: Span, refToId: string) => T,
    anchor: (span: Span, refId: string) => T,
    semantic: (span: Span, semantics: Semantic[]) => T,
    image: (image: ImageData) => T,
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
            ? fn.compound(span as Span[])
            : fn.default(span);
    } else if (isRefSpan(span)) {
        return fn.ref
            ? fn.ref(span.ref, span.refToId)
            : fn.default(span);
    } else if (isAnchorSpan(span)) {
        return fn.anchor
            ? fn.anchor(span.a, span.refId)
            : fn.default(span);
    } else if (isSemanticSpan(span)) {
        return fn.semantic
            ? fn.semantic(span.span, span.semantics)
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
        ref: (s, ref) => visitSpan(s, visitor),
        anchor: (s, id) => visitSpan(s, visitor),
        semantic: (s, sems) => visitSpan(s, visitor),
        simple: () => [],
        image: () => [],
        default: () => [],
    });
    return [...inside, visitor(span)];
}

export function processSpan(span: Span, fn: (s: Span) => Span): Span {
    const inside = mapSpanFull(span, {
        simple: s => s,
        compound: spans => compoundSpan(spans.map(s => processSpan(s, fn))),
        attr: (s, attr) => attrSpan(processSpan(s, fn), attr),
        ref: (s, ref) => refSpan(processSpan(s, fn), ref),
        anchor: (s, id) => anchorSpan(processSpan(s, fn), id),
        image: data => imageSpan(data),
        semantic: (s, sems) => semanticSpan(processSpan(s, fn), sems),
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
        ref: async (s, ref) => refSpan(await processSpanAsync(s, fn), ref),
        anchor: async (s, id) => anchorSpan(await processSpanAsync(s, fn), id),
        image: async data => imageSpan(data),
        semantic: async (s, sems) => semanticSpan(await processSpanAsync(s, fn), sems),
        default: async s => s,
    });
    return fn(inside);
}

export function extractSpanText(span: Span): string {
    return mapSpanFull(span, {
        simple: s => s,
        attr: extractSpanText,
        ref: extractSpanText,
        anchor: extractSpanText,
        compound: ss => ss
            .map(extractSpanText)
            .join(''),
        semantic: extractSpanText,
        image: () => '',
        default: () => '',
    });
}

export function normalizeSpan(span: Span): Span {
    if (isSimpleSpan(span)) {
        return span;
    } else if (isCompoundSpan(span)) {
        return normalizeCompoundSpan(span as Span[]);
    } else if (isRefSpan(span)) {
        return {
            ...span,
            ref: normalizeSpan(span.ref),
        };
    } else if (isAnchorSpan(span)) {
        return {
            ...span,
            a: normalizeSpan(span.a),
        };
    } else if (isSemanticSpan(span)) {
        return {
            ...span,
            span: normalizeSpan(span.span),
        };
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
        ref: (_, ref) => ref,
        default: () => undefined,
    }));
    return filterUndefined(results);
}
