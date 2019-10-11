import { Span } from './span';
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
    nodes: BookNode[],
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

export type BookNode =
    | GroupNode
    | ParagraphNode | TitleNode
    | TableNode | ListNode | SeparatorNode
    ;

export type HasSubnodes = GroupNode;

export type NodeKind = BookNode['node'];
export type NodeForKind<K extends NodeKind> = Extract<BookNode, { node: K }>;
