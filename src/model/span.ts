import { SupportSemantic } from './semantic';

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

export type ComplexSpan = SupportSemantic<
    CompoundSpan | FootnoteSpan | AttributedSpan,
    'correction'
>;

export type Span = SimpleSpan | ComplexSpan;
