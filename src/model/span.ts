import { NodeFlag } from './nodeFlag';
import { Image } from './image';

type DefSpan<K extends string> = {
    span: K,
    refId?: string,
    flags?: NodeFlag[],
    title?: string,
};
type NotObjectSpan = {
    span?: undefined,
    refId?: undefined,
    flags?: undefined,
    title?: undefined,
};

export type SimpleSpan = string & NotObjectSpan;
export type CompoundSpan = Span[] & NotObjectSpan;

export const attributeNames = [
    'italic', 'bold', 'small', 'big', 'sub', 'sup', 'quote', 'span',
] as const;
export type AttributeName = typeof attributeNames[number];
export type AttributedSpan = DefSpan<AttributeName> & {
    content: Span,
};

export type RubySpan = DefSpan<'ruby'> & {
    content: Span,
    explanation: string,
};

export type RefSpan = DefSpan<'ref'> & {
    content: Span,
    refToId: string,
};

export type ImageSpan = DefSpan<'image-span'> & {
    image: Image,
};

export type SingleSpan =
    | SimpleSpan
    | AttributedSpan
    | ImageSpan
    | RubySpan | RefSpan
    ;
export type Span = SingleSpan | CompoundSpan;
