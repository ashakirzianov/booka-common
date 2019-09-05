import { Span } from './span';
import { BookRange } from './bookRange';

type DefNode<N extends string> = {
    node: N,
    ref?: string,
};

export type ParagraphNode = DefNode<'paragraph'> & {
    span: Span,
};

export type ChapterTitle = string[];
export type ChapterNode = DefNode<'chapter'> & {
    level: number,
    title: ChapterTitle,
    nodes: BookContentNode[],
};

export type ImageUrlNode = DefNode<'image-url'> & {
    id: string,
    url: string,
};
export type ImageDataNode = DefNode<'image-data'> & {
    id: string,
    data: Buffer,
};
export type ImageNode = ImageUrlNode | ImageDataNode;

export type BookMeta = {
    title: string,
    author?: string,
    coverImageNode?: ImageNode,
};
export type VolumeNode = DefNode<'volume'> & {
    meta: BookMeta,
    nodes: BookContentNode[],
};

export type BookId = string;
export type Quote = {
    bookId: BookId,
    range: BookRange,
};
export type QuoteNode = DefNode<'quote'> & {
    quote: Quote,
};

export type BookContentNode = ChapterNode | ParagraphNode | ImageNode;
export type GeneratedContentNode = ParagraphNode | QuoteNode | ImageNode;
export type HasSubnodes = VolumeNode | ChapterNode;
export type Node =
    | ChapterNode | ParagraphNode | ImageNode
    | QuoteNode
    | VolumeNode
    ;
