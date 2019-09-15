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

export type ImageRefNode = DefNode<'image-ref'> & {
    imageId: string,
    imageRef: string,
};
export type ImageDataNode = DefNode<'image-data'> & {
    imageId: string,
    data: Buffer,
};
export type ImageNode = ImageRefNode | ImageDataNode;

export type TableCell = Span;
export type TableRow = TableCell[];
export type TableNode = DefNode<'table'> & {
    rows: TableRow[],
};

export type ListKind = 'ordered' | 'basic';
export type ListItem = Span;
export type ListNode = DefNode<'list'> & {
    kind: ListKind,
    items: ListItem[],
};

export type SeparatorNode = DefNode<'separator'>;

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
export type LibraryQuote = {
    bookId: BookId,
    range: BookRange,
};
export type QuoteNode = DefNode<'lib-quote'> & {
    quote: LibraryQuote,
};

export type BookContentNode =
    | ChapterNode | GroupNode
    | ParagraphNode | ImageNode
    | TableNode | ListNode | SeparatorNode
    ;
export type GeneratedContentNode = ParagraphNode | QuoteNode | ImageNode;
export type HasSubnodes = VolumeNode | ChapterNode;
export type Node =
    | BookContentNode
    | QuoteNode
    | VolumeNode
    ;
