type DefSemantic<S extends string, T = {}> = T & {
    semantic: S,
};

export type FootnoteSemantic = DefSemantic<'footnote', {
    title: string[],
}>;
export type CorrectionSemantic = DefSemantic<'correction', {
    note?: string,
}>;
export type QuoteSemantic = DefSemantic<'quote', {
    signature?: string[],
}>;

export type EpigraphSemantic = DefSemantic<'epigraph', {
    signature?: string[],
}>;

export type PoemSemantic = DefSemantic<'poem'>;

export type SemanticKey = Semantic['semantic'];
export type SemanticForKey<K extends SemanticKey> = Extract<Semantic, { semantic: K }>;

export type Semantic =
    | FootnoteSemantic
    | CorrectionSemantic
    | QuoteSemantic
    | EpigraphSemantic
    | PoemSemantic
    ;
