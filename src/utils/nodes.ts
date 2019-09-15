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
            case 'quote':
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

export async function processImagesAsync<N extends Node>(node: N, f: (image: ImageNode) => Promise<ImageNode>): Promise<N> {
    const n = node as Node;
    switch (n.node) {
        case 'volume':
            if (n.meta.coverImageNode) {
                const resolved = await f(n.meta.coverImageNode);
                node = {
                    ...node,
                    meta: {
                        coverImageNode: resolved,
                    },
                };
            }
        case 'chapter':
        case 'group':
            const nodes = await Promise.all(
                n.nodes.map(nn => processImagesAsync(nn, f))
            );
            return {
                ...node,
                nodes,
            };
        default:
            return node;
    }
}
