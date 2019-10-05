import {
    Node, SimpleParagraphNode, ImageNode, BookContentNode, Span, BookPath, ParagraphNode, HasSubnodes,
} from '../model';
import { extractSpanText } from './span';

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

export function makePph(span: Span): SimpleParagraphNode {
    return span;
}

export function pphSpan(p: ParagraphNode): Span {
    return p.node === undefined
        ? p
        : p.span;
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

export function processNode<T extends Node>(node: T, f: (n: Node) => Node): T;
export function processNode(node: Node, f: (n: Node) => Node): Node {
    switch (node.node) {
        case 'volume':
            if (node.meta.coverImageNode) {
                const resolved = f(node.meta.coverImageNode) as ImageNode;
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
            const nodes = node.nodes.map(nn => processNode(nn, f));
            node = {
                ...node,
                nodes,
            };
            break;
    }

    return f(node);
}

export async function processNodeAsync<T extends Node>(node: T, f: (n: Node) => Promise<Node>): Promise<T>;
export async function processNodeAsync(node: Node, f: (n: Node) => Promise<Node>): Promise<Node> {
    switch (node.node) {
        case 'volume':
            if (node.meta.coverImageNode) {
                const resolved = await f(node.meta.coverImageNode) as ImageNode;
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
                node.nodes.map(nn => processNodeAsync<BookContentNode>(nn, f))
            );
            node = {
                ...node,
                nodes,
            };
            break;
    }

    return f(node);
}

export function findReference(refId: string, node: Node): [Node, BookPath] | undefined {
    for (const [sub, path] of iterateNodePath(node)) {
        if (sub.refId === refId) {
            return [sub, path];
        }
    }
    return undefined;
}
