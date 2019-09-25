export type SupportSemantic<T, S extends SemanticKey = SemanticKey> = T &
    ({ semantic?: undefined } | Extract<Semantic, { semantic: S }>);

export type FootnoteSemantic = {
    semantic: 'footnote',
    title: string[],
};
export type CorrectionSemantic = {
    semantic: 'correction',
    note?: string,
};
export type QuoteSemantic = {
    semantic: 'quote',
    signature: string[],
};

export type EpigraphSemantic = {
    semantic: 'epigraph',
};

export type SemanticKey = Semantic['semantic'];
export type SemanticForKey<K extends SemanticKey> = Extract<Semantic, { semantic: K }>;
export type Semantic =
    | FootnoteSemantic
    | CorrectionSemantic
    | QuoteSemantic
    | EpigraphSemantic
    ;
