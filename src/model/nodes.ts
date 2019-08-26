import { Span } from './span';
import { BookRange } from './bookRange';

export type ParagraphNode = {
    node: 'paragraph',
    span: Span,
};

export type ChapterTitle = string[];
export type ChapterNode = {
    node: 'chapter',
    level: number,
    title: ChapterTitle,
    nodes: BookContentNode[],
};

export type ImageReference = {
    ref: 'image',
    id: string,
};
export type ImageNode = {
    node: 'image',
    ref: ImageReference,
};

export type BookMeta = {
    title: string,
    author?: string,
    coverImageId?: ImageReference,
};
export type VolumeNode = {
    node: 'volume',
    meta: BookMeta,
    nodes: BookContentNode[],
};

export type BookId = string;
export type Quote = {
    bookId: BookId,
    range: BookRange,
};
export type QuoteNode = {
    node: 'quote',
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
