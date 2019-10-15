import { BookNode } from './bookNode';
import { KnownTag } from './tag';
import { BookPath } from './bookRange';
import { Image, ImageDic } from './image';

export type BookLicense = 'unknown' | 'public-domain-us';
export type BookMeta = {
    title?: string,
    author?: string,
    coverImage?: Image,
    license: BookLicense,
};
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
