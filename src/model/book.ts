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

export type BookAnchor = {
    path: BookPath,
    title: string | undefined,
    position: number,
};
export type BookFragment = {
    current: BookAnchor,
    next?: BookAnchor,
    previous?: BookAnchor,
    images?: ImageDic,
    toc?: TableOfContents,
    nodes: BookNode[],
};

export type TableOfContentsItem = {
    title: string,
    level: number,
    path: BookPath,
    position: number,
};
export type TableOfContents = {
    items: TableOfContentsItem[],
    length: number,
};
