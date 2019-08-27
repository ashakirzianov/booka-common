import { VolumeNode, ImageReference } from './nodes';

export type BookReference = ImageReference;
export type RefDictionary = {
    [kind in BookReference['ref']]: {
        [key: string]: string | undefined;
    };
};
export type Book = {
    volume: VolumeNode,
    idDictionary: RefDictionary,
};
