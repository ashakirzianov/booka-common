import { BookRange } from './bookRange';

export type HighlightComment = string;
export type Highlight = {
    _id: string,
    group: string,
    range: BookRange,
    comment?: HighlightComment,
};
