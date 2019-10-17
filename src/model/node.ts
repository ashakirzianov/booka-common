import { NodeFlag } from './nodeFlag';
import { BookNode } from './bookNode';

export type DefNode<N extends string> = {
    node: N,
    refId?: string,
    flags?: NodeFlag[],
    title?: string,
};
export type NotObjectNode = {
    node?: undefined,
    refId?: undefined,
    flags?: undefined,
    title?: undefined,
};

export type Node = BookNode;
export type NodeKind = Node['node'];
export type NodeForKind<K extends NodeKind> = Extract<Node, { node: K }>;
