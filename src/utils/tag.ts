import { KnownTagName, KnownTag, KnownTagValue } from '../model';
import { distinct } from './misc';

export function tagValue<N extends KnownTagName>(tags: KnownTag[], name: N): KnownTagValue<N> | null {
    const tag = tags.find(t => t.tag === name);
    return tag
        ? tag.value as KnownTagValue<N>
        : null;
}

export function tagValues<N extends KnownTagName>(tags: KnownTag[], name: N): Array<KnownTagValue<N>> {
    const filtered = tags.filter(t => t.tag === name);
    const values = filtered.map(t => t.value);
    return values as Array<KnownTagValue<N>>;
}

export function sameTags(l: KnownTag, r: KnownTag): boolean {
    return l.tag === r.tag && l.value === r.value;
}

export function buildTagSet(tags: KnownTag[]): KnownTag[] {
    return distinct(tags, sameTags);
}
