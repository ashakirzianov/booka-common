export type AttributeName =
    | 'italic' | 'bold'
    | 'small' | 'big'
    | 'quote'
    | 'poem' | 'line' // TODO: remove ?
    ;
export type SimpleSpan = string & { span?: undefined };
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

type DefSemanticSpan<K extends string> = {
    span: 'semantic',
    semantic: K,
    content: Span,
};
export type SemanticSpan =
    | DefSemanticSpan<'correction'> & { note?: string }
    ;

export type Span =
    | SimpleSpan | CompoundSpan
    | FootnoteSpan | AttributedSpan
    | SemanticSpan
    ;
