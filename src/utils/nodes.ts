import {
    Node, SimpleParagraphNode, Span, BookPath, ParagraphNode, HasSubnodes, ImageNode, BookContentNode, NodeKind, NodeForKind, SubstitutableNode,
} from '../model';
import { extractSpanText } from './span';

export function makePph(span: Span): SimpleParagraphNode {
    return span;
}

export function pphSpan(p: ParagraphNode): Span {
    return p.node === undefined
        ? p
        : p.span;
}

export function hasSubnodes(bn: Node): bn is HasSubnodes {
    return bn.node === 'chapter' || bn.node === 'volume' || bn.node === 'group';
}

export function* iterateNodePath(node: Node): Generator<[Node, BookPath]> {
    yield [node, []];
    if (hasSubnodes(node)) {
        yield* iterateNodesPath(node.nodes);
    }
}

export function* iterateNodesPath(nodes: Node[]): Generator<[Node, BookPath]> {
    for (let idx = 0; idx < nodes.length; idx++) {
        for (const [subnode, subpath] of iterateNodePath(nodes)) {
            yield [subnode, [idx, ...subpath]];
        }
    }
}

export function* iterateNode(node: Node): Generator<Node> {
    yield node;
    if (hasSubnodes(node)) {
        for (const subnode of node.nodes) {
            for (const n of iterateNode(subnode)) {
                yield n;
            }
        }
    }
}

export function* iterateImageIds(bn: Node): Generator<string> {
    for (const node of iterateNode(bn)) {
        switch (node.node) {
            case 'image-ref':
            case 'image-data':
                if (node.imageId) {
                    yield node.imageId;
                }
                continue;
            case 'volume':
                if (node.meta.coverImageNode) {
                    if (node.meta.coverImageNode.imageId) {
                        yield node.meta.coverImageNode.imageId;
                    }
                }
                continue;
            default:
                continue;
        }
    }
}

export function* iterateReferencedBookIds(node: Node): Generator<string> {
    for (const subnode of iterateNode(node)) {
        if (subnode.node === 'lib-quote') {
            yield subnode.quote.bookId;
        }
    }
}

export function findReference(refId: string, node: Node): [Node, BookPath] | undefined {
    for (const [sub, path] of iterateNodePath(node)) {
        if (sub.refId === refId) {
            return [sub, path];
        }
    }
    return undefined;
}

export function extractNodeText(node: Node): string {
    switch (node.node) {
        case 'chapter':
        case 'volume':
        case 'group':
            return node.nodes
                .map(extractNodeText)
                .join('\n');
        case undefined:
            return extractSpanText(node);
        default:
            return '';
    }
}

// Process nodes:

export async function processNodeAsync<K extends NodeKind, N extends Node>(
    n: N,
    kind: K,
    f: (n: NodeForKind<K>,
    ) => Promise<SubstitutableNode<K>>): Promise<N> {
    let node = n as Node;
    switch (node.node) {
        case 'volume':
            const imageNode = node.meta.coverImageNode;
            if (imageNode && imageNode.node === kind) {
                const resolved = await f(imageNode as NodeForKind<K>) as ImageNode;
                node = {
                    ...node,
                    meta: {
                        ...node.meta,
                        coverImageNode: resolved,
                    },
                };
            }
        case 'chapter':
        case 'group':
            const nodes = await Promise.all(
                node.nodes.map(nn => processNodeAsync(nn, kind, f))
            );
            node = {
                ...node,
                nodes: nodes as BookContentNode[],
            };
            break;
    }

    if (node.node === kind) {
        node = await f(node as NodeForKind<K>);
    }

    return node as N;
}
