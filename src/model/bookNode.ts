import { Span } from './span';
import { Image } from './image';
import { DefNode } from './node';

export type ParagraphNode = DefNode<'pph'> & {
    span: Span,
};

export type TitleNode = DefNode<'title'> & {
    level: number,
    span: Span,
};

export type TableCell = {
    refId?: string,
    width?: number,
    span: Span,
};
export type TableRow = {
    refId?: string,
    kind?: 'header' | 'footer' | 'body',
    cells: TableCell[],
};
export type TableNode = DefNode<'table'> & {
    rows: TableRow[],
};

export type ListKind = 'ordered' | 'definitions' | 'basic';
export type ListItem = {
    refId?: string,
    span: Span,
};
export type ListNode = DefNode<'list'> & {
    kind: ListKind,
    start?: number,
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
