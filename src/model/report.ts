import { UserInfo } from './user';
import { CommentDescription } from './comment';
import { HasId } from '../contracts';

export type IssueReportKind = 'spam' | 'hate-speech';
export type IssueReport = {
    kind: IssueReportKind,
    author: UserInfo & HasId,
    comment: CommentDescription & HasId,
    date: Date,
};
