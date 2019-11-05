import { EditableNode } from './editable';
import { HasId } from './base';
import { BookPath } from './bookPath';

export type CommentTargetLocator = {
    target: 'pph',
    bookId: string,
    path: BookPath,
} | {
    target: 'comment',
    commentId: string,
};
export type CommentKind = 'question' | 'statement';
export type CommentContentNode = EditableNode;
export type CommentPost = {
    kind: CommentKind,
    content: CommentContentNode[],
    target: CommentTargetLocator,
};

export type CommentUpdate = HasId & Partial<Pick<CommentPost, 'content' | 'kind'>>;

export type Comment = CommentPost & HasId & {
    children: Comment[],
    rating: number,
    lastEdited: Date,
};
