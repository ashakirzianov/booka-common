import { Book } from '../model';
import { Page } from './helpers';

export type LibContract = {
    '/single': {
        get: {
            query: { id: string },
            return: Book,
        },
    },
    '/all': {
        get: {
            return: Page<Book>,
            query: { page?: number },
        },
    },
    '/info': {
        get: {
            return: Page<Book>,
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
