import {
    BookObject, BookCollection, Highlight, Bookmark,
} from './model';
import { AuthToken, UserInfo, UserBooks } from './user';
import { HasId } from './helpers';

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
            return: Array<Highlight & HasId>,
            auth: string,
            query: {
                bookId: string,
            },
        },
        post: {
            return: HasId,
            auth: string,
            query: {
                bookId: string,
            },
            body: Highlight,
        },
        patch: {
            return: boolean,
            auth: string,
            query: {
                bookId: string,
                highlightId: string,
            },
            body: Partial<Highlight>,
        },
        delete: {
            return: boolean,
            auth: string,
            query: {
                bookId: string,
                highlightId: string,
            },
        },
    },
    '/bookmarks': {
        get: {
            return: Array<Bookmark & HasId>,
            auth: string,
            query: {
                bookId: string,
            },
        },
        post: {
            return: HasId[],
            auth: string,
            query: {
                bookId: string,
            },
            body: Bookmark[],
        },
        delete: {
            return: boolean,
            auth: string,
            query: {
                id: string,
                bookId: string,
            },
        },
    },
    '/bookmarks/current': {
        put: {
            return: HasId,
            auth: string,
            query: {
                bookId: string,
            },
            body: Pick<Bookmark, 'source' | 'created' | 'location'>,
        },
    },
};
