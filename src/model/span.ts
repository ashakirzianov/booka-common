import { NodeFlag } from './nodeFlag';
import { Image } from './image';
import { NotObjectNode, DefNode } from './node';

export type SimpleSpan = string & NotObjectNode;
export type CompoundSpan = Span[] & NotObjectNode;

export const attributeNames = [
    'italic', 'bold', 'small', 'big', 'sub', 'sup', 'quote', 'span',
] as const;
export type AttributeName = typeof attributeNames[number];
export type AttributedSpan = DefNode<AttributeName> & {
    span: Span,
};
export type SpanAttribute = {
    attr: AttributeName,
    span: Span,
};

export type RubySpan = DefNode<'ruby'> & {
    span: Span,
    explanation: string,
};

export type RefSpan = DefNode<'ref'> & {
    span: Span,
    refToId: string,
};

export type ImageSpan = DefNode<'image-span'> & {
    image: Image,
};

export type Span =
    | SimpleSpan
    | AttributedSpan
    | ImageSpan
    | CompoundSpan
    | RubySpan | RefSpan
    ;
