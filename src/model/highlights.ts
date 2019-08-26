import { BookRange } from './bookRange';

export type HighlightComment = string;
export type Highlight = {
    group: string,
    range: BookRange,
    comment?: HighlightComment,
};
