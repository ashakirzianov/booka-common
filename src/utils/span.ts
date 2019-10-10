import {
    Span, CompoundSpan, AttributeName, attributeNames,
    SimpleSpan, RefSpan, SemanticSpan, AttributedSpan, ImageSpan,
    ImageData, SpanAttribute, Semantic,
} from '../model';
import { guard } from './misc';

const isSimple = guard<SimpleSpan>(s => typeof s === 'string');
const isCompound = guard<CompoundSpan>(s => Array.isArray(s));
const isRef = guard<RefSpan>(s => s.ref !== undefined);
const isSemantic = guard<SemanticSpan>(s => s.span !== undefined);
const isImage = guard<ImageSpan>(s => s.image !== undefined);

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
    semantic: (span: Span, semantics: Semantic[]) => T,
    image: (image: ImageData) => T,
};
type DefaultSpanHandler<T> = {
    default: (span: Span) => T,
};
export function mapSpan<T>(span: Span, fn: Partial<SpanMapFn<T>> & DefaultSpanHandler<T>): T {
    if (isSimple(span)) {
        return fn.simple
            ? fn.simple(span)
            : fn.default(span);
    } else if (isCompound(span)) {
        return fn.compound
            ? fn.compound(span as Span[])
            : fn.default(span);
    } else if (isRef(span)) {
        return fn.ref
            ? fn.ref(span.ref, span.refToId)
            : fn.default(span);
    } else if (isSemantic(span)) {
        return fn.semantic
            ? fn.semantic(span.span, span.semantics)
            : fn.default(span);
    } else if (isImage(span)) {
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

export function compoundSpan(spans: Span[]): Span {
    return spans.length === 1
        ? spans[0]
        : spans;
}

export function subSpans(span: CompoundSpan): Span[] {
    return span as Span[];
}

export function spanAttr(span: Span): AttributeName | undefined {
    for (const an of attributeNames) {
        const attr = (span as any)[an];
        if (attr !== undefined) {
            return attr;
        }
    }

    return undefined;
}

export function extractSpanText(span: Span): string {
    return mapSpanFull(span, {
        simple: s => s,
        attr: extractSpanText,
        ref: extractSpanText,
        compound: ss => ss
            .map(extractSpanText)
            .join(''),
        semantic: extractSpanText,
        image: () => '',
        default: () => '',
    });
}

export function spanTextLength(span: Span): number {
    return extractSpanText(span).length;
}

export function normalizeSpan(span: Span): Span {
    if (isSimple(span)) {
        return span;
    } else if (isCompound(span)) {
        return normalizeCompoundSpan(span as Span[]);
    } else if (isRef(span)) {
        return {
            ...span,
            ref: normalizeSpan(span.ref),
        };
    } else if (isSemantic(span)) {
        return {
            ...span,
            span: normalizeSpan(span.span),
        };
    } else if (isImage(span)) {
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
    let idx = 0;
    let current: SimpleSpan | undefined = undefined;
    while (idx < spans.length) {
        const span = normalizeSpan(spans[idx]);
        if (isSimple(span)) {
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
        idx++;
    }
    if (current !== undefined) {
        result.push(current);
    }

    return result.length === 0 ? ''
        : result.length === 1 ? result[0]
            : result;
}
