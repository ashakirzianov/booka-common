export type Tag<K extends string = string, V = undefined> =
    & { tag: K }
    & (V extends undefined ? { value?: undefined } : { value: V })
    ;

export type ImpressionTag =
    | Tag<'liked'> | Tag<'favorite'>;
export type UserTag =
    | ImpressionTag
    | Tag<'finished'> | Tag<'want-to-read'> | Tag<'current'> | Tag<'in-library'>
    ;

export type KnownTag = UserTag;
export type KnownTagName = KnownTag['tag'];
