import { CommentDescription } from './comment';

export type VoteKind = 'like' | 'dislike';

export type Vote = {
    kind: VoteKind,
    comment: CommentDescription,
};
