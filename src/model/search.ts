import { LibraryCard } from './card';

export type BookSearchResult = {
    search: 'book',
    card: LibraryCard,
};

export type SearchResult = BookSearchResult;
