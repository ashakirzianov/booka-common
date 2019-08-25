import { BookReference, RefDictionary } from '../model';

export function resolveRef(id: BookReference, dictionary: RefDictionary): string | undefined {
    const objectDic = dictionary[id.ref];

    return objectDic[id.id];
}
