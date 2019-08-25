import {
    Node, HasSubnodes,
    VolumeNode, ChapterNode, ParagraphNode, ImageNode, ImageReference,
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

export function isImage(bn: Node): bn is ImageNode {
    return bn.node === 'image';
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

export function collectImageIds(bn: Node): ImageReference[] {
    switch (bn.node) {
        case 'chapter':
            return bn.nodes
                .map(collectImageIds)
                .reduce((all, one) => all.concat(one), []);
        case 'image':
            return [bn.id];
        case 'paragraph':
            return [];
        case 'volume':
            return bn.nodes
                .map(collectImageIds)
                .reduce((all, one) => all.concat(one), [])
                .concat(bn.meta.coverImageId ? [bn.meta.coverImageId] : []);
        default:
            // TODO: assert never?
            return [];
    }
}
