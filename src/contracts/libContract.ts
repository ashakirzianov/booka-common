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
            return: BookFragment,
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
            return: Book,
        },
    },
    '/all': {
        get: Paginate<{
            return: LibraryCard[],
        }>,
    },
    '/upload': {
        post: {
            return: string,
            files: 'book',
            auth: string,
        },
    },
    '/card/batch': {
        post: {
            return: Array<{
                card: LibraryCard,
                previews: Array<string | undefined>,
            } | undefined>,
            body: Array<{
                id: string,
                previews?: BookPath[],
            }>,
        },
    },
};
