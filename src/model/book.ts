import { BookNode } from './bookNode';
import { KnownTag, BookLicense } from './tag';
import { BookPath, BookNodePath } from './bookPath';
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

export type LibraryCard = {
    id: string,
    alias: string,
    title: string,
    author?: string,
    coverUrl?: string,
    smallCoverUrl?: string,
    tags: KnownTag[],
};

export type BookAnchor = {
    path: BookNodePath,
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
    title: string | undefined,
    items: TableOfContentsItem[],
    length: number,
};
