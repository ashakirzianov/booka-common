import { Span } from './span';
import { BookRange } from './bookRange';
import { Semantic } from './semantic';

type DefNode<N extends string> = {
    node: N,
    refId?: string,
    semantics?: Semantic[],
};

export type ParagraphNode = DefNode<'pph'> & {
    span: Span,
};

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

export type TableCell = {
    spans: Span[],
};
export type TableRow = {
    cells: TableCell[],
};
export type TableNode = DefNode<'table'> & {
    rows: TableRow[],
};

export type ListKind = 'ordered' | 'basic';
export type ListItem = {
    spans: Span[],
};
export type ListNode = DefNode<'list'> & {
    kind: ListKind,
    items: ListItem[],
};

export type SeparatorNode = DefNode<'separator'>;

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
    | ParagraphNode | TitleNode
    | TableNode | ListNode | SeparatorNode
    ;
// TODO: remove
export type GeneratedContentNode = ParagraphNode | QuoteNode;
// TODO: remove
export type HasSubnodes = ChapterNode;
// TODO: merge with 'BookNode' ?
export type Node =
    | BookContentNode
    | QuoteNode
    ;

export type NodeKind = Node['node'];
export type NodeForKind<K extends NodeKind> = Extract<Node, { node: K }>;
// TODO: remove
export type SubstitutableNode<K extends NodeKind> =
    K extends BookContentNode['node'] ? BookContentNode
    : NodeForKind<K>;
