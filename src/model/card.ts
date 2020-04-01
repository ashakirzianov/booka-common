import { KnownTag } from './tag';

export type LibraryCard = {
    id: string,
    alias: string,
    title: string,
    author?: string,
    coverUrl?: string,
    smallCoverUrl?: string,
    tags: KnownTag[],
    length: number,
};

export type CardCollectionName =
    | 'reading-list' | 'uploads';
export type CardCollection = {
    name: CardCollectionName,
    cards: LibraryCard[],
};
export type CardCollections = {
    [k in CardCollectionName]?: LibraryCard[];
};
