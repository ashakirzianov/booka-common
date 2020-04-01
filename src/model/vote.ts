import { DefEntity } from './base';

export type VoteKind = 'like' | 'dislike';
export type Vote = DefEntity<'vote'> & {
    kind: VoteKind,
    commentId: string,
};
