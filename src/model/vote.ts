import { CommentDescription } from './comment';

export type VoteKind = 'like' | 'dislike';

export type VotePost = {
    kind: VoteKind,
    commentId: string,
};
export type Vote = VotePost & {
    _id: string,
};

export type ResolvedVote = Vote & {
    preview: CommentDescription,
};
