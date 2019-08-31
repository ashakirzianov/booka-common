import { VolumeNode, ImageReference } from './nodes';
import { KnownTag } from './tag';

export type BookReference = ImageReference;
export type RefDictionary = {
    [kind in BookReference['ref']]?: {
        [key: string]: string | undefined;
    };
};
export type Book = {
    volume: VolumeNode,
    idDictionary?: RefDictionary,
};

export type BookInfo = {
    id: string,
    title: string,
    author?: string,
    cover?: string,
    tags: KnownTag[],
};
