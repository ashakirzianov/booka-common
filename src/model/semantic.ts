export type SupportSemantic<T, S extends SemanticKey = SemanticKey> = T &
    ({ semantic?: undefined } | Extract<Semantic, { semantic: S }>);

export type FootnoteSemantic = {
    semantic: 'footnote',
    title: string[],
};
export type FootnoteContainerSemantic = {
    semantic: 'footnote-container',
};

export type SemanticKey = Semantic['semantic'];
export type Semantic = FootnoteSemantic | FootnoteContainerSemantic;
