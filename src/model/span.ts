import { Semantic } from './semantic';

type ImageDataBase = {
    imageId: string,
    title?: string,
};
export type ImageRefData = ImageDataBase & {
    kind: 'ref',
    ref: string,
};
export type ImageBufferData = ImageDataBase & {
    kind: 'buffer',
    buffer: Buffer,
};
export type ImageData = ImageRefData | ImageBufferData;

export type SimpleSpan = string;
export type CompoundSpan = {
    [n: number]: Span,
    compound?: undefined,
};

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
    anchor: Span,
    refId: string,
};

export type ImageSpan = {
    image: ImageData,
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
