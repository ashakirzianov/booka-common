import { Book, BookCollection } from '../model';

export type LibContract = {
    '/single': {
        get: {
            query: { id: string },
            return: Book,
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
