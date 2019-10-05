import {
    Span, SimpleSpan, RefSpan, AttributedSpan, CompoundSpan, AttributeName, ComplexSpan,
} from '../model';
import { assertNever } from './misc';

export function isSimpleSpan(span: Span): span is SimpleSpan {
    return typeof span === 'string';
}

export function isRefSpan(span: Span): span is RefSpan {
    return span.span === 'ref';
}

export function isAttributedSpan(span: Span): span is AttributedSpan {
    return span.span === 'attrs';
}

export function isCompoundSpan(span: Span): span is (CompoundSpan) {
    return Array.isArray(span);
}

export function isComplexSpan(span: Span): span is ComplexSpan {
    return span.span === 'complex';
}

export function compoundSpan(spans: Span[]): Span {
    return spans.length === 1
        ? spans[0]
        : spans;
}

export function subSpans(span: CompoundSpan): Span[] {
    return span as Span[];
}

export function assignAttributes(...attributes: AttributeName[]) {
    return (span: Span): AttributedSpan => {
        return {
            span: 'attrs',
            content: span,
            attrs: attributes,
        };
    };
}

export function spanAttrs(span: Span) {
    const arr = isAttributedSpan(span) && span.attrs
        ? span.attrs
        : [];

    return attrObject(arr);
}

export type AttributesObject = {
    [k in AttributeName]?: boolean;
};
function attrObject(attributes: AttributeName[]): AttributesObject {
    return attributes
        .reduce((as, a) =>
            ({ ...as, [a]: true }), {} as AttributesObject);
}

export function extractSpanText(span: Span): string {
    if (isSimpleSpan(span)) {
        return span;
    } else if (isAttributedSpan(span) || isRefSpan(span)) {
        return extractSpanText(span.content);
    } else if (isCompoundSpan(span)) {
        return subSpans(span)
            .map(extractSpanText)
            .join('');
    } else if (isComplexSpan(span)) {
        return extractSpanText(span.content);
    } else {
        assertNever(span);
        return '';
    }
}

export function spanTextLength(span: Span): number {
    return extractSpanText(span).length;
}
