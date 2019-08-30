import { GeneratedContentNode } from './nodes';
import { BookPath } from './bookRange';

export type CommentLocation = {
    bookId: string,
    path: BookPath,
};
export type CommentDescription = {
    commentId: string,
    location?: CommentLocation,
    textPreview: string,
};
export type CommentKind = 'question' | 'statement';
export type CommentContentNode = GeneratedContentNode;
export type CommentData = {
    kind: CommentKind,
    content: GeneratedContentNode[],
};

export type Comment = CommentData & {
    _id: string,
    children: Comment[],
    rating: number,
    lastEdited: Date,
    location?: CommentLocation,
};
