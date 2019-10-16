import { Semantic } from './semantic';
import { Image } from './image';

export type SimpleSpan = string;
export type CompoundSpan = Span[];

export const attributeNames = [
    'italic', 'bold', 'small', 'big', 'sub', 'sup',
] as const;
export type AttributeName = typeof attributeNames[number];
export type AttributedSpan = {
    [k in AttributeName]: {
        [kk in k]: Span;
    };
}[AttributeName];
export type SpanAttribute = {
    attr: AttributeName,
    span: Span,
};

export type RefSpan = {
    ref: Span,
    refToId: string,
};

export type AnchorSpan = {
    a: Span,
    refId: string,
};

export type ImageSpan = {
    image: Image,
};

export type SemanticSpan = {
    span: Span,
    semantics: Semantic[],
};

export type Span =
    | SimpleSpan
    | CompoundSpan
    | AttributedSpan
    | RefSpan
    | AnchorSpan
    | SemanticSpan
    | ImageSpan
    ;
