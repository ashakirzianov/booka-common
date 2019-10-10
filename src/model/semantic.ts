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

type TechNote = DefSemantic<'tech-note', {
    source?: string,
}>;

export type FlagSemantic =
    | DefSemantic<'poem'> | DefSemantic<'letter'>
    | DefSemantic<'chapter-abstract'>
    | DefSemantic<'character-name'>
    | DefSemantic<'formated'> | DefSemantic<'side-note'>
    | DefSemantic<'editor-note'> | DefSemantic<'extracts'>
    | DefSemantic<'footer'> | DefSemantic<'table-of-contents'>
    | DefSemantic<'title-page'>
    | DefSemantic<'illustrations'>
    | DefSemantic<'junk'>
    ;
export type FlagSemanticKey = FlagSemantic['semantic'];

export type SemanticKey = Semantic['semantic'];
export type SemanticForKey<K extends SemanticKey> = Extract<Semantic, { semantic: K }>;

export type Semantic =
    | TechNote
    | Footnote | Correction
    | Quote | Epigraph
    | FlagSemantic
    ;
