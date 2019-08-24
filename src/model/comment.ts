import { GeneratedContentNode } from './nodes';

export type CommentKind = 'question' | 'statement';
export type CommentData = {
    kind: CommentKind,
    content: GeneratedContentNode[],
};

export type Comment = CommentData & {
    children: Comment[],
    rating: number,
    lastEdited: Date,
};
