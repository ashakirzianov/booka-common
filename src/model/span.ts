import { NodeFlag } from './nodeFlag';
import { Image } from './image';

type DefSpan<K extends string> = {
    spanKind: K,
    refId?: string,
    title?: string,
    flags?: NodeFlag[],
};
type NotObjectSpan = {
    spanKind?: undefined,
    refId?: undefined,
    title?: undefined,
    flags?: undefined,
};

export type SimpleSpan = string & NotObjectSpan;
export type CompoundSpan = Span[] & NotObjectSpan;

export const attributeNames = [
    'italic', 'bold', 'small', 'big', 'sub', 'sup', 'quote', 'span',
] as const;
export type AttributeName = typeof attributeNames[number];
export type AttributedSpan = DefSpan<AttributeName> & {
    span: Span,
};
export type SpanAttribute = {
    attr: AttributeName,
    span: Span,
};

export type RubySpan = DefSpan<'ruby'> & {
    span: Span,
    explanation: string,
};

export type RefSpan = DefSpan<'ref'> & {
    span: Span,
    refToId: string,
};

export type ImageSpan = DefSpan<'image-span'> & {
    image: Image,
};

export type Span =
    | SimpleSpan
    | AttributedSpan
    | ImageSpan
    | CompoundSpan
    | RubySpan | RefSpan
    ;
