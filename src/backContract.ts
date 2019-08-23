import { BookObject } from './bookFormat';
import { AuthToken, UserInfo, UserBooks } from './user';
import { BookCollection } from './bookCollection';
import { Highlight } from './highlights';

export type BackContract = {
    '/auth/fbtoken': {
        get: {
            return: AuthToken,
            query: { token: string },
        },
    },
    '/me/info': { get: { return: UserInfo, auth: string } },
    '/me/books': { get: { return: UserBooks, auth: string } },
    '/book/single': {
        get: {
            return: BookObject,
            query: { id: string },
        },
    },
    '/book/all': { get: { return: BookCollection } },
    '/book/upload': {
        post: {
            return: string,
            files: 'book',
            auth: string,
        },
    },
    '/highlights': {
        get: {
            return: Highlight[],
            auth: string,
            query: {
                bookId: string,
            },
        },
        post: {
            return: string,
            auth: string,
            query: {
                bookId: string,
                highlight: Highlight,
            },
        },
        patch: {
            return: boolean,
            auth: string,
            query: {
                bookId: string,
                highlightId: string,
                highlight: Partial<Highlight>,
            },
        },
    },
};
