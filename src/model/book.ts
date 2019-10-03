import { VolumeNode, BookContentNode } from './nodes';
import { KnownTag } from './tag';
import { BookPath } from './bookRange';

export type BookLicense = 'unknown' | 'public-domain-us';
export type EpubBookSource = {
    source: 'epub',
    kind: string,
};
export type BookSource = EpubBookSource;
export type Book = {
    volume: VolumeNode,
    tags: KnownTag[],
};

export type BookInfo = {
    id: string,
    title: string,
    author?: string,
    cover?: string,
    tags: KnownTag[],
};

export type BookFragment = {
    current: BookPath,
    next?: BookPath,
    previous?: BookPath,
    nodes: BookContentNode[],
};

export type TableOfContentsItem = {
    title: string[],
    level: number,
    path: BookPath,
};
export type TableOfContents = {
    items: TableOfContentsItem[],
};
