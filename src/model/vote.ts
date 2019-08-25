import { BookPath } from './bookRange';

export type VoteKind = 'like' | 'dislike';

export type CommentDescription = {
    commentId: string,
    bookId: string,
    path: BookPath[],
    textPreview: string,
};
export type Vote = {
    kind: VoteKind,
    comment: CommentDescription,
};
