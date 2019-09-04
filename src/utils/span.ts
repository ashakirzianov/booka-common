import {
    Span, SimpleSpan, FootnoteSpan, AttributedSpan, CompoundSpan, AttributeName, SemanticSpan,
} from '../model';

export function isSimpleSpan(span: Span): span is SimpleSpan {
    return typeof span === 'string';
}

export function isFootnoteSpan(span: Span): span is FootnoteSpan {
    return typeof span === 'object' && span.span === 'note';
}

export function isAttributedSpan(span: Span): span is AttributedSpan {
    return typeof span === 'object' && span.span === 'attrs';
}

export function isSemanticSpan(span: Span): span is SemanticSpan {
    return typeof span === 'object' && span.span === 'semantic';
}

export function isCompoundSpan(span: Span): span is CompoundSpan {
    return typeof span === 'object' && span.span === 'compound';
}

export function assign(...attributes: AttributeName[]) {
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
    if (typeof span === 'string') {
        return span;
    }

    switch (span.span) {
        case 'attrs':
            return extractSpanText(span);
        case 'note':
            return extractSpanText(span.content);
        case 'compound':
            return span.spans
                .map(extractSpanText)
                .join('');
        default:
            // TODO: assert never ?
            return '';
    }
}
