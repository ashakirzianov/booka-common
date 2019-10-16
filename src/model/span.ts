import { NodeFlag } from './nodeFlag';
import { Image } from './image';

export type SimpleSpan = string;
export type CompoundSpan = Span[];

export const attributeNames = [
    'italic', 'bold', 'small', 'big', 'sub', 'sup', 'quote',
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

export type ComplexSpanData = {
    refId?: string,
    refToId?: string,
    title?: string,
    ruby?: string,
    flags?: NodeFlag[],
};
export type ComplexSpan = ComplexSpanData & {
    span: Span,
};

export type ImageSpan = {
    image: Image,
};

export type Span =
    | SimpleSpan
    | AttributedSpan
    | ImageSpan
    | CompoundSpan
    | ComplexSpan
    ;
