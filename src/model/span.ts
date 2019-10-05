import { SupportSemantic } from './semantic';

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

export type RefSpan = {
    ref: Span,
    refToId: string,
};

type SpanSemanticKey = 'correction' | 'quote';
export type SpanSemantic = SemanticSpan['semantic'];
export type SemanticSpan = SupportSemantic<{
    span2: Span,
},
    SpanSemanticKey
>;

export type Span =
    | SimpleSpan
    | CompoundSpan
    | AttributedSpan
    | RefSpan
    | SemanticSpan
    ;
