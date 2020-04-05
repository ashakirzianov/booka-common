export type VoteKind = 'like' | 'dislike';
export type Vote = {
    kind: VoteKind,
    commentId: string,
};
