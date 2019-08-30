import { CommentDescription } from './comment';

export type VoteKind = 'like' | 'dislike';

export type Vote = {
    _id: string,
    kind: VoteKind,
    comment: CommentDescription,
};
