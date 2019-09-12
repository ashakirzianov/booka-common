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
export type RefSpan = {
    span: 'ref',
    refToId: string,
    content: Span,
};

export type ComplexSpan = SupportSemantic<
    CompoundSpan | RefSpan | AttributedSpan,
    'correction'
>;

export type Span = SimpleSpan | ComplexSpan;
