import {
    Book, BookDesc, BookFragment, BookPositionLocator, SearchResult,
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
            return: BookDesc[],
        }>,
    },
    '/upload': {
        post: {
            return: string,
            files: 'book',
            auth: string,
        },
    },
    '/previews': {
        post: {
            return: Array<string | undefined>,
            body: BookPositionLocator[],
        },
    },
};
