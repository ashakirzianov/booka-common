import { LibraryCard } from './book';

export type BookSearchResult = {
    search: 'book',
    desc: LibraryCard,
};

export type SearchResult = BookSearchResult;
