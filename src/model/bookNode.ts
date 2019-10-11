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

export type BookContentNode =
    | GroupNode
    | ParagraphNode | TitleNode
    | TableNode | ListNode | SeparatorNode
    ;

export type HasSubnodes = GroupNode;
// TODO: merge with 'BookNode' ?
export type Node = BookContentNode;

export type NodeKind = Node['node'];
export type NodeForKind<K extends NodeKind> = Extract<Node, { node: K }>;
