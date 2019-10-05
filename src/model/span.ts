import { SupportSemantic } from './semantic';

export type SimpleSpan = string;
export type CompoundSpan = {
    [n: number]: Span,
};

export const attributeNames = [
    'italic', 'bold', 'small', 'big', 'sub', 'sup',
] as const;
export type AttributeName = typeof attributeNames[number];
export type AttributedSpan = {
    [k in AttributeName]: {
        [kk in k]: Span;
    };
}[AttributeName];

export type RefSpan = {
    ref: Span,
    refToId: string,
};

type SpanSemanticKey = 'correction' | 'quote';
export type SpanSemantic = SemanticSpan['semantic'];
export type SemanticSpan = SupportSemantic<{
    span2: Span,
},
    SpanSemanticKey
>;

export type Span =
    | SimpleSpan
    | CompoundSpan
    | AttributedSpan
    | RefSpan
    | SemanticSpan
    ;
