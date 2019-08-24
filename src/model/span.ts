export type AttributeName = 'italic' | 'bold' | 'poem' | 'line';
export type SimpleSpan = string;
export type AttributedSpan = {
    span: 'attrs',
    content: Span,
    attrs?: AttributeName[],
};
export type CompoundSpan = {
    span: 'compound',
    spans: Span[],
};
export type FootnoteId = string;
export type FootnoteSpan = {
    span: 'note',
    content: Span,
    footnote: Span,
    id: FootnoteId,
    title: string[],
};
export type Span =
    | SimpleSpan | CompoundSpan
    | FootnoteSpan | AttributedSpan
    ;
