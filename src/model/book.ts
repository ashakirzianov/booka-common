import { BookNode } from './bookNode';
import { KnownTag, BookLicense } from './tag';
import { BookPath } from './bookRange';
import { Image, ImageDic } from './image';

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

export type BookDesc = {
    id: string,
    title: string,
    author?: string,
    coverUrl?: string,
    smallCoverUrl?: string,
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

export type BookPositionLocator = {
    id: string,
    path: BookPath,
};

export type BookRangeLocator = {
    id: string,
    start: BookPath,
    end?: BookPath,
};
