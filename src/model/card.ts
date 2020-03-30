import { KnownTag } from './tag';

export type LibraryCard = {
    id: string,
    alias: string,
    title: string,
    author?: string,
    coverUrl?: string,
    smallCoverUrl?: string,
    tags: KnownTag[],
};

export type CardCollectionName =
    | 'reading-list' | 'uploads';
export type CardCollection = {
    cards: LibraryCard[],
};
export type CardCollections = {
    [k in CardCollectionName]?: LibraryCard[];
};
