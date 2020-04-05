import { LibraryCard } from './card';

export type BookSearchResult = {
    search: 'book',
    // TODO: rename
    desc: LibraryCard,
};

export type SearchResult = BookSearchResult;
