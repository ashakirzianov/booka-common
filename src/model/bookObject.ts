import { VolumeNode, ImageReference } from './bookNode';

export type BookReference = ImageReference;
export type RefDictionary = {
    [kind in BookReference['ref']]: {
        [key: string]: string | undefined;
    };
};
export type BookObject = {
    volume: VolumeNode,
    idDictionary: RefDictionary,
};
