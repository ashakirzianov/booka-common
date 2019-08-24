export type VoteKind = 'like' | 'dislike';

export type CommentDescription = {
    commentId: string,
    textPreview: string,
};
export type Vote = {
    kind: VoteKind,
    comment: CommentDescription,
};
