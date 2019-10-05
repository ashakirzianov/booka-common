import {
    Node, SimpleParagraphNode, Span, BookPath, ParagraphNode, HasSubnodes, ImageData, BookFragment, BookContentNode,
} from '../model';
import { extractSpanText } from './span';
import { addPaths } from './bookRange';

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

export function* iterateBookFragment(fragment: BookFragment): Generator<[BookContentNode, BookPath]> {
    for (const [node, path] of iterateNodesPath(fragment.nodes)) {
        yield [
            node as BookContentNode,
            addPaths(fragment.current, path),
        ];
    }
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
            case 'image':
                yield node.image.imageId;
                continue;
            case 'volume':
                if (node.meta.coverImage) {
                    yield node.meta.coverImage.imageId;
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

export async function processNodeImagesAsync<N extends Node>(n: N, f: (image: ImageData) => Promise<ImageData>): Promise<N> {
    let node = n as Node;
    switch (node.node) {
        case 'volume':
            if (node.meta.coverImage) {
                const processed = await f(node.meta.coverImage);
                node = {
                    ...node,
                    meta: {
                        ...node.meta,
                        coverImage: processed,
                    },
                };
            }
        case 'chapter':
        case 'group':
            const nodes = await Promise.all(
                node.nodes.map(nn => processNodeImagesAsync(nn, f))
            );
            node = {
                ...node,
                nodes: nodes,
            };
            break;
        case 'image':
            const image = await f(node.image);
            node = {
                ...node,
                image,
            };
            break;
    }

    return node as N;
}
