import { VolumeNode, ImageId } from './bookNode';

// TODO: rename 'Reference'
export type ObjectId = ImageId;
// TODO: rename 'RefDictionary'
export type IdDictionary = {
    [kind in ObjectId['kind']]: {
        [key: string]: string | undefined;
    };
};
export type BookObject = {
    volume: VolumeNode,
    idDictionary: IdDictionary,
};
