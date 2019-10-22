import { Book, BookDesc, BookFragment, BookPath, BookPositionLocator } from '../model';
import { Paginate } from './helpers';

export type LibContract = {
    '/search': {
        get: Paginate<{
            return: BookDesc[],
            query: { query: string },
            auth?: string,
        }>,
    },
    '/fragment': {
        get: {
            return: BookFragment,
            body: BookPositionLocator,
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
        },
    },
    '/previews': {
        get: {
            return: string[],
            body: BookPositionLocator[],
        },
    },
};
