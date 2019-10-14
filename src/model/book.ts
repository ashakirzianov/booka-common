import { BookNode } from './bookNode';
import { KnownTag } from './tag';
import { BookPath } from './bookRange';
import { Image, ImageDic } from './image';

export type BookLicense = 'unknown' | 'public-domain-us';
// TODO: remove
export type EpubBookSource = {
    source: 'epub',
    kind: string,
};
export type BookMeta = {
    title?: string,
    author?: string,
    coverImage?: Image,
    // TODO: add license ?
};
export type BookSource = EpubBookSource;
export type Book = {
    nodes: BookNode[],
    meta: BookMeta,
    tags: KnownTag[],
    images: ImageDic,
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
    images?: ImageDic,
    nodes: BookNode[],
};

export type TableOfContentsItem = {
    title: string,
    level: number,
    path: BookPath,
};
export type TableOfContents = {
    items: TableOfContentsItem[],
};
