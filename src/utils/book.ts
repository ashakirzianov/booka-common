import { BookReference, RefDictionary } from '../model';

export function resolveRef(id: BookReference, dictionary?: RefDictionary): string | undefined {
    const objectDic = dictionary && dictionary[id.ref];
    const resolved = objectDic && objectDic[id.id];

    return resolved;
}
