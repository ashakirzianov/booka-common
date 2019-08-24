import { BookObject, BookCollection } from '../model';

export type LibContract = {
    '/single': {
        get: {
            query: { id: string },
            return: BookObject,
        },
    },
    '/all': {
        get: { return: BookCollection },
    },
    '/upload': {
        post: {
            return: string,
            files: 'book',
        },
    },
};
