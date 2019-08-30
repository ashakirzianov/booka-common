import { AccountInfo } from './account';
import { CommentDescription } from './comment';

export type IssueReportKind = 'spam' | 'hate-speech';
export type IssueReport = {
    kind: IssueReportKind,
    author: AccountInfo,
    comment: CommentDescription,
    date: Date,
};
