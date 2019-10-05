import {
    Span, CompoundSpan, AttributeName, attributeNames, SpanSemantic, SimpleSpan,
} from '../model';
import { assertNever } from './misc';

// export function isSimpleSpan(span: Span): span is SimpleSpan {
//     return typeof span === 'string';
// }

// export function isRefSpan(span: Span): span is RefSpan {
//     return (span as any).refToId !== undefined;
// }

// export function isAttributedSpan(span: Span): span is AttributedSpan {
//     return attributeNames.some(an => (span as any)[an] !== undefined);
// }

// export function isCompoundSpan(span: Span): span is CompoundSpan {
//     return Array.isArray(span);
// }

// export function isComplexSpan(span: Span): span is ComplexSpan {
//     return (span as any).span !== undefined;
// }

type SpanMapFn<T> = {
    simple: (span: SimpleSpan) => T,
    compound: (spans: Span[]) => T,
    attr: (span: Span, attr: AttributeName) => T,
    ref: (span: Span, refToId: string) => T,
    semantic: (span: Span, semantic: SpanSemantic) => T,
};
type DefaultSpanHandler<T> = {
    default: (span: Span) => T,
};
export function mapSpan<T>(span: Span, fn: Partial<SpanMapFn<T>> & DefaultSpanHandler<T>): T {
    const s = span as any;
    if (typeof span === 'string') {
        if (fn.simple) {
            return fn.simple(span);
        }
    } else if (Array.isArray(span)) {
        if (fn.compound) {
            return fn.compound(span);
        }
    } else if (s.ref !== undefined) {
        if (fn.ref) {
            return fn.ref(s.ref, s.refToId);
        }
    } else if (s.span !== undefined) {
        if (fn.semantic) {
            return fn.semantic(s.span, s.semantic);
        }
    } else if (fn.attr) {
        for (const an of attributeNames) {
            if (s[an] !== undefined) {
                return fn.attr(s[an], an);
            }
        }
    }
    return fn.default(span);
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
        default: () => '',
    });
}

export function spanTextLength(span: Span): number {
    return extractSpanText(span).length;
}
