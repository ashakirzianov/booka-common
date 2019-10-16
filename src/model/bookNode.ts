import { Span } from './span';
import { Semantic } from './semantic';
import { Image } from './image';

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
    span: Span,
};

export type TableCell = {
    width?: number,
    span: Span,
};
export type TableRow = {
    kind?: 'header' | 'footer' | 'body',
    cells: TableCell[],
};
export type TableNode = DefNode<'table'> & {
    rows: TableRow[],
};

export type ListKind = 'ordered' | 'basic';
export type ListItem = {
    span: Span,
};
export type ListNode = DefNode<'list'> & {
    kind: ListKind,
    items: ListItem[],
};

export type ImageNode = DefNode<'image'> & {
    image: Image,
};

export type SeparatorNode = DefNode<'separator'>;

export type IgnoreNode = DefNode<'ignore'> & {
    name?: string,
    extra?: any,
};

export type BookNode =
    | ParagraphNode | TitleNode
    | TableNode | ListNode
    | ImageNode
    | SeparatorNode
    | IgnoreNode
    ;

export type NodeKind = BookNode['node'];
export type NodeForKind<K extends NodeKind> = Extract<BookNode, { node: K }>;
