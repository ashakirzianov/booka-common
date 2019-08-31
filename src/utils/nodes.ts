import {
    Node, HasSubnodes,
    VolumeNode, ChapterNode, ParagraphNode, ImageRefNode, ImageReference,
} from '../model';

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

export function isImageRef(bn: Node): bn is ImageRefNode {
    return bn.node === 'image-ref';
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

export function collectImageRefs(bn: Node): ImageReference[] {
    switch (bn.node) {
        case 'chapter':
            return bn.nodes
                .map(collectImageRefs)
                .reduce((all, one) => all.concat(one), []);
        case 'image-ref':
            return [bn.ref];
        case 'paragraph':
            return [];
        case 'volume':
            return bn.nodes
                .map(collectImageRefs)
                .reduce((all, one) => all.concat(one), [])
                .concat(bn.meta.coverImageId ? [bn.meta.coverImageId] : []);
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
