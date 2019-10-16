import { BookPath } from './bookRange';
import { EditableNode } from './editable';

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
export type CommentContentNode = EditableNode;
export type CommentData = {
    kind: CommentKind,
    content: CommentContentNode[],
};

export type Comment = CommentData & {
    _id: string,
    children: Comment[],
    rating: number,
    lastEdited: Date,
    location?: CommentLocation,
};
