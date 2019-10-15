import { Book, BookDesc } from '../model';
import { Paginate } from './helpers';

export type LibContract = {
    '/download': {
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
    '/info': {
        get: {
            return: BookDesc[],
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
