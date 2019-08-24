import { Span } from './span';

export type ParagraphNode = {
    node: 'paragraph',
    span: Span,
};

export type ChapterTitle = string[];
export type ChapterNode = {
    node: 'chapter',
    level: number,
    title: ChapterTitle,
    nodes: ContentNode[],
};

// TODO: rename 'ImageReference'
export type ImageId = {
    // TODO: rename 'ref'
    kind: 'image',
    // TODO: rename 'id'
    reference: string,
};
export type ImageNode = {
    node: 'image',
    id: ImageId,
};
export type ContentNode = ChapterNode | ParagraphNode | ImageNode;

export type BookMeta = {
    title: string,
    author?: string,
    coverImageId?: ImageId,
};
export type VolumeNode = {
    node: 'volume',
    meta: BookMeta,
    nodes: ContentNode[],
};

export type BookNode = VolumeNode | ContentNode;
export type HasSubnodes = VolumeNode | ChapterNode;
