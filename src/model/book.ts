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

export type BookAnchor = {
    path: BookNodePath,
    title: string | undefined,
    position: number,
};
export type BookFragment = {
    current: BookAnchor,
    next?: BookAnchor,
    previous?: BookAnchor,
    nodes: BookNode[],
};
export type AugmentedBookFragment = BookFragment & {
    toc?: TableOfContents,
    images?: ImageDic,
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
