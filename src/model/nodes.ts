import { Span } from './span';
import { BookRange } from './bookRange';
import { SupportSemantic } from './semantic';

type DefNode<N extends string> = {
    node: N,
    refId?: string,
};

export type ParagraphNode = DefNode<'paragraph'> & {
    span: Span,
};

export type GroupNode = SupportSemantic<DefNode<'group'> & {
    nodes: BookContentNode[],
}, 'footnote'>;

export type ChapterTitle = string[];
export type ChapterNode = SupportSemantic<DefNode<'chapter'> & {
    level: number,
    title: ChapterTitle,
    nodes: BookContentNode[],
}, 'footnote'>;

export type ImageUrlNode = DefNode<'image-url'> & {
    id: string,
    url: string,
};
export type ImageDataNode = DefNode<'image-data'> & {
    id: string,
    data: Buffer,
};
export type ImageNode = ImageUrlNode | ImageDataNode;

export type VolumeMeta = {
    title?: string,
    author?: string,
    coverImageNode?: ImageNode,
};
export type VolumeNode = DefNode<'volume'> & {
    meta: VolumeMeta,
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

export type BookContentNode =
    | ChapterNode | GroupNode | ParagraphNode | ImageNode;
export type GeneratedContentNode = ParagraphNode | QuoteNode | ImageNode;
export type HasSubnodes = VolumeNode | ChapterNode;
export type Node =
    | BookContentNode
    | QuoteNode
    | VolumeNode
    ;
