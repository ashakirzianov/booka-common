export type SupportSemantic<T, S extends SemanticKey = SemanticKey> = T & {
    semantic?: Partial<SemanticForKey<S>>,
};

type DefSemantic<S extends string, T = {}> = {
    [k in S]: T;
};
export type FootnoteSemantic = DefSemantic<'footnote', {
    title: string[],
}>;
export type CorrectionSemantic = DefSemantic<'correction', {
    note?: string,
}>;
export type QuoteSemantic = DefSemantic<'quote', {
    signature: string[],
}>;

export type EpigraphSemantic = DefSemantic<'epigraph', {
    signature: string[],
}>;

export type PoemSemantic = DefSemantic<'poem'>;

export type SemanticKey = keyof Semantic;
export type SemanticForKey<K extends SemanticKey> = Pick<Semantic, K>;
export type HasSemantic<K extends SemanticKey> = {
    semantic: SemanticForKey<K>,
};
export type Semantic =
    & FootnoteSemantic
    & CorrectionSemantic
    & QuoteSemantic
    & EpigraphSemantic
    & PoemSemantic
    ;
