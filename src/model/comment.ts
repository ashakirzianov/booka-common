import { BookPath } from './bookPath';
import { EditableNode } from './editable';

export type CommentTargetLocator = {
    target: 'pph',
    bookId: string,
    path: BookPath,
} | {
    target: 'comment',
    commentId: string,
};
export type CommentKind = 'question' | 'statement';
export type Comment = {
    uuid: string,
    kind: CommentKind,
    content: EditableNode[],
    target: CommentTargetLocator,
    children: Comment[],
    rating: number,
    lastEdited: Date,
};
