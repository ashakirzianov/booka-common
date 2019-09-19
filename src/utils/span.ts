import {
    Span, SimpleSpan, RefSpan, AttributedSpan, CompoundSpan, AttributeName,
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

export function isCompoundSpan(span: Span): span is CompoundSpan {
    return span.span === 'compound';
}

export function compoundSpan(spans: Span[]): Span {
    return spans.length === 1
        ? spans[0]
        : {
            span: 'compound',
            spans,
        };
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
    switch (span.span) {
        case 'attrs':
        case 'ref':
            return extractSpanText(span.content);
        case 'compound':
            return span.spans
                .map(extractSpanText)
                .join('');
        case undefined:
            return span;
        default:
            assertNever(span);
            return '';
    }
}

export function spanTextLength(span: Span): number {
    switch (span.span) {
        case undefined:
            return span.length;
        case 'attrs':
        case 'ref':
            return spanTextLength(span.content);
        case 'compound':
            return span.spans.reduce((len, s) => len + spanTextLength(s), 0);
        default:
            assertNever(span);
            return 0;
    }
}
