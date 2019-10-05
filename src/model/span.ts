import { SupportSemantic } from './semantic';

export type AttributeName =
    | 'italic' | 'bold'
    | 'small' | 'big'
    | 'subscript' | 'superscript'
    | 'quote'
    | 'poem'
    ;
export type SimpleSpan = string & { span?: undefined };
export type AttributedSpan = {
    span: 'attrs',
    content: Span,
    attrs?: AttributeName[],
};
export type CompoundSpan = {
    [n: number]: Span,
    span?: undefined,
};
export type RefSpan = {
    span: 'ref',
    refToId: string,
    content: Span,
};

export type ComplexSpan = SupportSemantic<
    // TODO: rename 'content' to 'span'
    { content: Span, span: 'complex' },
    'correction'
>;

export type Span =
    | SimpleSpan
    | CompoundSpan
    | RefSpan
    | AttributedSpan
    | ComplexSpan
    ;
