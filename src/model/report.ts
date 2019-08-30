import { UserInfo } from './user';
import { CommentDescription } from './comment';

export type IssueReportKind = 'spam' | 'hate-speech';
export type IssueReport = {
    kind: IssueReportKind,
    author: UserInfo,
    comment: CommentDescription,
    date: Date,
};
