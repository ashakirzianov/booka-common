import { BookPath } from './bookRange';

export type BookPositionLocator = {
    loc: 'book-pos',
    id: string,
    path: BookPath,
};

export type BookRangeLocator = {
    loc: 'book-range',
    id: string,
    start: BookPath,
    end?: BookPath,
};

export type CommentLocator = {
    loc: 'comment',
    id: string,
};
