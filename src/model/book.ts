import { ImageData } from './span';
import { BookContentNode } from './nodes';
import { KnownTag } from './tag';
import { BookPath } from './bookRange';

export type BookLicense = 'unknown' | 'public-domain-us';
// TODO: remove
export type EpubBookSource = {
    source: 'epub',
    kind: string,
};
export type BookMeta = {
    title?: string,
    author?: string,
    coverImage?: ImageData,
};
export type BookSource = EpubBookSource;
export type Book = {
    nodes: BookContentNode[],
    meta: BookMeta,
    tags: KnownTag[],
};

// TODO: remove
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
