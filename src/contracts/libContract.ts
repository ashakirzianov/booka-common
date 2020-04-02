import {
    Book, LibraryCard, BookFragment, SearchResult, BookPath, CardCollection,
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
    '/preview': {
        get: {
            return: { preview: string | undefined },
            query: {
                bookId: string,
                node: number,
            },
        },
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
    '/uploads': {
        get: {
            return: CardCollection,
            auth: string,
        },
        post: {
            return: string,
            files: 'book',
            auth: string,
            query: {
                publicDomain?: boolean,
            },
        },
    },
    '/popular': {
        get: {
            return: LibraryCard[],
        },
    }
    '/card': {
        get: {
            query: { id: string },
            return: LibraryCard,
        },
    },
};
