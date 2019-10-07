type DefSemantic<S extends string, T = {}> = T & {
    semantic: S,
};

type Footnote = DefSemantic<'footnote', {
    title: string[],
}>;
type Correction = DefSemantic<'correction', {
    note?: string,
}>;
type Quote = DefSemantic<'quote', {
    signature?: string[],
}>;

type Epigraph = DefSemantic<'epigraph', {
    signature?: string[],
}>;
type FlagSemantic =
    | DefSemantic<'poem'> | DefSemantic<'formated'>
    | DefSemantic<'editor-note'> | DefSemantic<'extracts'>
    ;

export type SemanticKey = Semantic['semantic'];
export type SemanticForKey<K extends SemanticKey> = Extract<Semantic, { semantic: K }>;

export type Semantic =
    | Footnote | Correction
    | Quote | Epigraph
    | FlagSemantic
    ;
