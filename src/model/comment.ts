import { EditableNode } from './editable';
import { BookPositionLocator, CommentLocator } from './locator';
import { HasId } from './base';

export type CommentTargetLocator = CommentLocator | BookPositionLocator;
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
