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

export type ImageReference = {
    ref: 'image',
    id: string,
};
export type ImageNode = {
    node: 'image',
    id: ImageReference,
};
export type ContentNode = ChapterNode | ParagraphNode | ImageNode;

export type BookMeta = {
    title: string,
    author?: string,
    coverImageId?: ImageReference,
};
export type VolumeNode = {
    node: 'volume',
    meta: BookMeta,
    nodes: ContentNode[],
};

export type BookNode = VolumeNode | ContentNode;
export type HasSubnodes = VolumeNode | ChapterNode;
