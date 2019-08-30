import { Book, BookInfo } from '../model';
import { Paginate } from './helpers';

export type LibContract = {
    '/single': {
        get: {
            query: { id: string },
            return: Book,
        },
    },
    '/all': {
        get: Paginate<{
            return: BookInfo[],
        }>,
    },
    '/info': {
        get: {
            return: BookInfo[],
            query: { ids: string[] },
        },
    },
    '/upload': {
        post: {
            return: string,
            files: 'book',
        },
    },
};
