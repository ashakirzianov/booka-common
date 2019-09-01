import { Tag, KnownTagName, KnownTag, KnownTagValue } from '../model';

export function tagValue<N extends KnownTagName>(tags: KnownTag[], name: N): KnownTagValue<N> | null {
    const tag = tags.find(t => t.tag === name);
    return tag
        ? tag.value as KnownTagValue<N>
        : null;
}
