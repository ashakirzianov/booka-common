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

export type SemanticKey = Semantic['semantic'];
export type Semantic =
    | FootnoteSemantic
    | CorrectionSemantic
    ;
