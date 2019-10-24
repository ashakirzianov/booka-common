import { HasId } from './base';

export type VoteKind = 'like' | 'dislike';

export type VotePost = {
    kind: VoteKind,
    commentId: string,
};

export type Vote = VotePost & HasId & {
    commentPreview: string,
};
