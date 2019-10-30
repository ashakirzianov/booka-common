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
    current: {
        path: BookPath,
        title: string | undefined,
    },
    next?: {
        path: BookPath,
        title: string | undefined,
    },
    previous?: {
        path: BookPath,
        title: string | undefined,
    },
    images?: ImageDic,
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
