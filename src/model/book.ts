import { VolumeNode } from './nodes';
import { KnownTag } from './tag';

export type EpubBookSource = {
    source: 'epub',
    kind: string,
};
export type BookSource = EpubBookSource;
export type Book = {
    volume: VolumeNode,
    source: BookSource,
};

export type BookInfo = {
    id: string,
    title: string,
    author?: string,
    cover?: string,
    tags: KnownTag[],
};
