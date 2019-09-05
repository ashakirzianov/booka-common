import { Span, AttributeName } from './span';
import { BookRange } from './bookRange';
import { KnownTag } from './tag';

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

export type RefNode = DefNode<'ref'> & {
    to: string,
    content: RawBookNode,
};
export type ImageRefNode = DefNode<'image-ref'> & {
    imageId: string,
};
export type TitleNode = DefNode<'title'> & {
    title: string[],
    level: number,
};
export type TagNode = DefNode<'tag'> & {
    tag: KnownTag,
};
export type SpanNode = DefNode<'span'> & {
    span: Span,
};
export type IgnoreNode = DefNode<'ignore'>;
export type RawContainerNode = DefNode<'container'> & {
    nodes: RawBookNode[],
};
export type AttrNode = DefNode<'attr'> & {
    attributes: AttributeName[],
    content: RawBookNode,
};
export type RawBookNode =
    | RefNode | ImageRefNode | TitleNode | TagNode | SpanNode | IgnoreNode
    | AttrNode
    | RawContainerNode
    | ImageNode
    ;

export type BookContentNode = ChapterNode | ParagraphNode | ImageNode;
export type GeneratedContentNode = ParagraphNode | QuoteNode | ImageNode;
export type HasSubnodes = VolumeNode | ChapterNode;
export type Node =
    | BookContentNode
    | RawBookNode
    | QuoteNode
    | VolumeNode
    ;
