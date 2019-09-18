import {
    Node, HasSubnodes,
    VolumeNode, ChapterNode, ParagraphNode, ImageNode, BookContentNode, GroupNode,
} from '../model';
import { extractSpanText } from './span';

export function hasSubnodes(bn: Node): bn is HasSubnodes {
    return bn.node === 'chapter' || bn.node === 'volume';
}

export function isVolume(bn: Node): bn is VolumeNode {
    return bn.node === 'volume';
}

export function isChapter(bn: Node): bn is ChapterNode {
    return bn.node === 'chapter';
}

export function isParagraph(bn: Node): bn is ParagraphNode {
    return bn.node === 'paragraph';
}

export function isImage(bn: Node): bn is ImageNode {
    return bn.node === 'image-ref' || bn.node === 'image-data';
}

export function isGroup(bn: Node): bn is GroupNode {
    return bn.node === 'group';
}

export function nodeChildren(node: Node) {
    return hasSubnodes(node) ? node.nodes : [];
}

export function volumeToString(volume: VolumeNode) {
    return JSON.stringify(volume);
}

export function nodeToString(bn: Node) {
    return JSON.stringify(bn);
}

export function collectImageIds(bn: Node): string[] {
    switch (bn.node) {
        case 'chapter':
            return bn.nodes
                .map(collectImageIds)
                .reduce((all, one) => all.concat(one), []);
        case 'image-ref':
        case 'image-data':
            return bn.imageId ? [bn.imageId] : [];
        case 'paragraph':
            return [];
        case 'volume':
            const coverIds = bn.meta.coverImageNode && bn.meta.coverImageNode.imageId
                ? [bn.meta.coverImageNode.imageId]
                : [];
            return bn.nodes
                .map(collectImageIds)
                .reduce((all, one) => all.concat(one), [])
                .concat(coverIds);
        default:
            // TODO: assert never?
            return [];
    }
}

export function collectReferencedBookIds(nodes: Node[]): string[] {
    const result = [] as string[];
    for (const node of nodes) {
        switch (node.node) {
            case 'lib-quote':
                result.push(node.quote.bookId);
                break;
            case 'volume':
            case 'chapter':
                result.push(...collectReferencedBookIds(node.nodes));
                break;
            default:
                break;
        }
    }
    return result;
}

export function* iterateNodes(nodes: Node[]) {
    for (const node of nodes) {
        yield* iterateNode(node);
    }
}

export function* iterateNode(node: Node): IterableIterator<Node> {
    yield node;
    switch (node.node) {
        case 'chapter':
        case 'volume':
            yield* iterateNodes(node.nodes);
            break;
    }
}

export function extractNodeText(node: Node): string {
    switch (node.node) {
        case 'chapter':
        case 'volume':
        case 'group':
            return node.nodes
                .map(extractNodeText)
                .join('');
        case 'paragraph':
            return extractSpanText(node.span);
        default:
            return '';
    }
}

export function isEmptyNode(node: Node): boolean {
    const text = extractNodeText(node);
    return text ? true : false;
}

export function containedNodes(node: Node): BookContentNode[] {
    switch (node.node) {
        case 'chapter':
        case 'volume':
            return node.nodes;
        default:
            return [];
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
