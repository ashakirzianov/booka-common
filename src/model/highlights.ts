import { BookRangeLocator } from './book';

export type HighlightComment = string;
export type Highlight = {
    _id: string,
    group: string,
    location: BookRangeLocator,
    comment?: HighlightComment,
};
