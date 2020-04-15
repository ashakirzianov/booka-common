import {
    Book, LibraryCard, BookFragment, SearchResult, BookPath, CardCollection, TableOfContents,
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
                id: string,
                node: number,
            },
        },
    },
    '/position': {
        get: {
            return: {
                position: number,
                of: number,
            },
            query: {
                id: string,
                node: number,
                span?: number,
            },
        },
    },
    '/toc': {
        get: {
            return: TableOfContents,
            query: { id: string },
        },
    },
    '/fragment': {
        get: {
            return: {
                fragment: BookFragment,
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
            },
        },
    },
    '/uploads': {
        get: {
            return: CardCollection,
            auth: string,
        },
        post: {
            return: {
                bookId: string,
            },
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
    '/cards': {
        get: {
            query: { ids: string[] },
            return: Array<LibraryCard | undefined>,
        },
    },
};
