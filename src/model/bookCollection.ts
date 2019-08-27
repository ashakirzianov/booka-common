import { KnownTag } from './tag';

export type BookInfo = {
    id: string,
    title: string,
    author?: string,
    cover?: string,
    tags: KnownTag[],
};

export type BookCollection = {
    books: BookInfo[],
};
