export type Tag<K extends string = string, V = undefined> =
    & { tag: K }
    & (V extends undefined ? { value?: undefined } : { value: V })
    ;

export type ImpressionTag =
    | Tag<'liked'> | Tag<'favorite'>;
export type UserTag =
    | ImpressionTag
    | Tag<'finished'> | Tag<'want-to-read'> | Tag<'current'> | Tag<'in-library'>
    | Tag<'uploaded'>
    ;

export type BookLicense =
    | 'unknown'
    | 'public-domain'
    | 'public-domain-us'
    | 'pg-copyrighted'
    | 'pg-unknown'
    ;
export type BookLicenseTag = Tag<'license', BookLicense>;

export type BookMetaTag =
    | Tag<'pg-index', number> | Tag<'pg-skip'>
    | Tag<'title', string> | Tag<'author', string> | Tag<'cover-ref', string>
    | Tag<'language', string>
    | Tag<'subject', string>
    | Tag<'publish-year', number> | Tag<'publish-city', string>
    | Tag<'translator', string>
    | Tag<'publisher', string>
    | Tag<'description', string>
    | Tag<'series', string>
    | Tag<'ISBN', string>
    | Tag<'rights', string>
    ;

export type KnownTag =
    | UserTag
    | BookMetaTag
    | BookLicenseTag
    ;

export type KnownTagName = KnownTag['tag'];
export type KnownTagValue<N extends KnownTagName> = Extract<KnownTag, { tag: N }>['value'];
