import { BookPath } from './bookRange';

export type BookPositionLocator = {
    id: string,
    path: BookPath,
};

export type BookRangeLocator = {
    id: string,
    start: BookPath,
    end?: BookPath,
};
