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
export type ImageRefNode = {
    node: 'image-ref',
    ref: ImageReference,
};
export type ImageUrlNode = {
    node: 'image-url',
    url: string,
};
export type ImageDataNode = {
    node: 'image-data',
    data: Buffer,
};
export type ImageNode = ImageRefNode | ImageUrlNode | ImageDataNode;

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
