import { Span, ImageData } from './span';
import { BookRange } from './bookRange';
import { Semantic } from './semantic';

type DefNode<N extends string> = {
    node: N,
    refId?: string,
    semantics?: Semantic[],
};

export type SimpleParagraphNode = Span & { node?: undefined, refId?: undefined };
export type ComplexParagraphNode = DefNode<'pph'> & {
    span: Span,
};
export type ParagraphNode = SimpleParagraphNode | ComplexParagraphNode;

export type TitleNode = DefNode<'title'> & {
    level: number,
    lines: string[],
};

export type GroupNode = DefNode<'group'> & {
    nodes: BookContentNode[],
};

export type ChapterTitle = string[];
export type ChapterNode = DefNode<'chapter'> & {
    level: number,
    title: ChapterTitle,
    nodes: BookContentNode[],
};

export type ImageNode = DefNode<'image'> & {
    image: ImageData,
};

export type TableCell = Span;
export type TableRow = {
    cells: TableCell[],
};
export type TableNode = DefNode<'table'> & {
    rows: TableRow[],
};

export type ListKind = 'ordered' | 'basic';
export type ListItem = {
    item: Span,
};
export type ListNode = DefNode<'list'> & {
    kind: ListKind,
    items: ListItem[],
};

export type SeparatorNode = DefNode<'separator'>;

export type VolumeMeta = {
    title?: string,
    author?: string,
    coverImage?: ImageData,
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
    | ParagraphNode | ImageNode | TitleNode
    | TableNode | ListNode | SeparatorNode
    ;
export type GeneratedContentNode = ParagraphNode | QuoteNode | ImageNode;
export type HasSubnodes = VolumeNode | ChapterNode;
export type Node =
    | BookContentNode
    | QuoteNode
    | VolumeNode
    ;

export type NodeKind = Node['node'];
export type NodeForKind<K extends NodeKind> = Extract<Node, { node: K }>;
export type SubstitutableNode<K extends NodeKind> =
    K extends BookContentNode['node'] ? BookContentNode
    : NodeForKind<K>;
