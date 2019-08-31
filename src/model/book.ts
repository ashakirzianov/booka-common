import { VolumeNode } from './nodes';
import { KnownTag } from './tag';

export type Book = {
    volume: VolumeNode,
};

export type BookInfo = {
    id: string,
    title: string,
    author?: string,
    cover?: string,
    tags: KnownTag[],
};
