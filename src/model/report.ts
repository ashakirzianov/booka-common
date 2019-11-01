export type IssueTargetLocator = {
    target: 'comment',
    commentId: string,
};
export type IssueReportKind = 'spam' | 'hate-speech';
export type IssueReportPost = {
    kind: IssueReportKind,
    target: IssueTargetLocator,
};
