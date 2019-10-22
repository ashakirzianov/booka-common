import { EditableNode } from './editable';
import { BookPositionLocator } from './locator';

export type CommentDescription = {
    commentId: string,
    location: BookPositionLocator,
    textPreview: string,
};

export type CommentKind = 'question' | 'statement';
export type CommentContentNode = EditableNode;
export type CommentPost = {
    kind: CommentKind,
    content: CommentContentNode[],
    location: BookPositionLocator,
};

export type Comment = CommentPost & {
    _id: string,
    children: Comment[],
    rating: number,
    lastEdited: Date,
};

export type CommentUpdate = Partial<Pick<CommentPost, 'content' | 'kind'>>;
