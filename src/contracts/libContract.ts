import {
    Book, LibraryCard, BookFragment, SearchResult, BookPath,
} from '../model';
import { Paginate } from './helpers';

export type LibContract = {
    '/search': {
        get: Paginate<{
            return: SearchResult[],
            query: { query: string },
            auth?: string,
        }>,
    },
    '/fragment': {
        get: {
            return: {
                fragment: BookFragment,
                card: LibraryCard,
            },
            query: {
                id: string,
                path: string,
            },
            auth?: string,
        },
    },
    '/full': {
        get: {
            query: { id: string },
            return: {
                book: Book,
                card: LibraryCard,
            },
        },
    },
    '/upload': {
        post: {
            return: string,
            files: 'book',
            auth: string,
        },
    },
    '/card': {
        get: {
            query: { id: string },
            return: LibraryCard,
        },
    },
    '/card/batch': {
        post: {
            return: Array<{
                card: LibraryCard,
                previews: Array<string | undefined>,
            }>,
            body: Array<{
                id: string,
                previews?: BookPath[],
            }>,
        },
    },
};
