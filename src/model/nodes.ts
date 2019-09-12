import { Span } from './span';
import { BookRange } from './bookRange';
import { KnownTag } from './tag';
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

export type ImageRefNode = DefNode<'image-ref'> & {
    imageId: string,
};
export type TitleNode = DefNode<'chapter-title'> & {
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
export type RawCompoundNode = SupportSemantic<DefNode<'compound-raw'> & {
    nodes: RawBookNode[],
}, 'footnote'>;
export type RawBookNode =
    | ImageRefNode | TitleNode | TagNode | SpanNode | IgnoreNode
    | RawCompoundNode
    | ImageNode
    ;

export type BookContentNode =
    | ChapterNode | GroupNode | ParagraphNode | ImageNode;
export type GeneratedContentNode = ParagraphNode | QuoteNode | ImageNode;
export type HasSubnodes = VolumeNode | ChapterNode;
export type Node =
    | BookContentNode
    | RawBookNode
    | QuoteNode
    | VolumeNode
    ;
