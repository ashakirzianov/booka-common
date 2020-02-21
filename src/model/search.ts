import { LibraryCard } from './card';

export type BookSearchResult = {
    search: 'book',
    desc: LibraryCard,
};

export type SearchResult = BookSearchResult;
