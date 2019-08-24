import {
    BookNode, HasSubnodes, ChapterNode, ParagraphNode, Span,
    SimpleSpan, FootnoteSpan, AttributedSpan, CompoundSpan,
    AttributeName, VolumeNode, ImageNode, ImageReference,
    BookReference, RefDictionary,
} from './model';

export function hasSubnodes(bn: BookNode): bn is HasSubnodes {
    return bn.node === 'chapter' || bn.node === 'volume';
}

export function isVolume(bn: BookNode): bn is VolumeNode {
    return bn.node === 'volume';
}

export function isChapter(bn: BookNode): bn is ChapterNode {
    return bn.node === 'chapter';
}

export function isParagraph(bn: BookNode): bn is ParagraphNode {
    return bn.node === 'paragraph';
}

export function isImage(bn: BookNode): bn is ImageNode {
    return bn.node === 'image';
}

export function isSimpleSpan(span: Span): span is SimpleSpan {
    return typeof span === 'string';
}

export function isFootnoteSpan(span: Span): span is FootnoteSpan {
    return typeof span === 'object' && span.span === 'note';
}

export function isAttributedSpan(span: Span): span is AttributedSpan {
    return typeof span === 'object' && span.span === 'attrs';
}

export function isCompoundSpan(span: Span): span is CompoundSpan {
    return typeof span === 'object' && span.span === 'compound';
}

export function children(node: BookNode) {
    return hasSubnodes(node) ? node.nodes : [];
}

export function assign(...attributes: AttributeName[]) {
    return (span: Span): AttributedSpan => {
        return {
            span: 'attrs',
            content: span,
            attrs: attributes,
        };
    };
}

export function compoundSpan(spans: Span[]): Span {
    return { span: 'compound', spans };
}

export function paragraphNode(span: Span): ParagraphNode {
    return {
        node: 'paragraph',
        span,
    };
}

export function attrs(span: Span) {
    const arr = isAttributedSpan(span) && span.attrs
        ? span.attrs
        : [];

    return attrObject(arr);
}

export type AttributesObject = {
    [k in AttributeName]?: boolean;
};
function attrObject(attributes: AttributeName[]): AttributesObject {
    return attributes
        .reduce((as, a) =>
            ({ ...as, [a]: true }), {} as AttributesObject);
}

export function volumeToString(volume: VolumeNode) {
    return JSON.stringify(volume);
}

export function nodeToString(bn: BookNode) {
    return JSON.stringify(bn);
}

export function collectImageIds(bn: BookNode): ImageReference[] {
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

export function resolveRef(id: BookReference, dictionary: RefDictionary): string | undefined {
    const objectDic = dictionary[id.ref];

    return objectDic[id.id];
}
