import { GeneratedContentNode } from './nodes';
import { BookPath } from './bookRange';

export type CommentLocation = {
    bookId: string,
    path: BookPath,
};
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
