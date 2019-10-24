import { BookDesc } from './book';

export type BookSearchResult = {
    search: 'book',
    desc: BookDesc,
};

export type SearchResult = BookSearchResult;
