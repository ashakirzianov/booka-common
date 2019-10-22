import { CommentLocator } from './locator';

export type IssueReportKind = 'spam' | 'hate-speech';
export type IssueReportPost = {
    kind: IssueReportKind,
    comment: CommentLocator,
};
