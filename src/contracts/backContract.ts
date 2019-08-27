import {
    Book, BookCollection, Highlight, Bookmark,
    AuthToken, UserInfo, UserBooks,
    Comment, CommentLocation, CommentData, Vote, VoteKind,
    NoteData, Note, BookInfo, IssueReportKind,
} from '../model';
import { HasId, Page } from './helpers';
import { KnownTag, KnownTagName } from '../model/tag';
import { BookEvent } from '../model/history';

export type BackContract = {
    '/auth/fbtoken': {
        get: {
            return: AuthToken,
            query: { token: string },
        },
    },
    '/me/info': { get: { return: UserInfo, auth: string } },
    '/me/books': { get: { return: UserBooks, auth: string } },
    '/books/single': {
        get: {
            return: Book,
            query: { id: string },
        },
    },
    '/books/all': { get: { return: BookCollection } },
    '/books/upload': {
        post: {
            return: string,
            files: 'book',
            auth: string,
        },
    },
    '/books': {
        get: {
            return: Page<BookInfo>,
            auth: string,
            query: {
                tags?: string[],
                page?: number,
            },
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
                highlightId: string,
            },
            body: Partial<Highlight>,
        },
        delete: {
            return: boolean,
            auth: string,
            query: {
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
    '/comments': {
        get: {
            return: Array<Comment & HasId>,
            body: CommentLocation,
        },
        post: {
            return: HasId,
            auth: string,
            body: {
                location: CommentLocation,
                comment: CommentData,
            },
        },
        patch: {
            return: boolean,
            auth: string,
            query: {
                commentId: string,
            },
            body: Partial<CommentData>,
        },
        delete: {
            return: boolean,
            auth: string,
            query: {
                commentId: string,
            },
        },
    },
    '/subcomments': {
        post: {
            return: HasId,
            auth: string,
            query: {
                commentId: string,
            },
            body: CommentData,
        },
    },
    '/votes': {
        get: {
            return: Page<Vote & HasId>,
            auth: string,
            query: {
                bookId?: string,
                page?: number,
            },
        },
        post: {
            return: HasId,
            auth: string,
            query: {
                commentId: string,
                kind: VoteKind,
            },
        },
        delete: {
            return: boolean,
            auth: string,
            query: {
                voteId: string,
            },
        },
    },
    '/notes': {
        post: {
            return: HasId,
            auth: string,
            body: NoteData,
        },
        patch: {
            return: boolean,
            auth: string,
            query: {
                noteId: string,
            },
            body: Partial<NoteData>,
        },
        delete: {
            return: boolean,
            auth: string,
            query: {
                noteId: string,
            },
        },
    },
    '/notes/single': {
        get: {
            return: Note & HasId,
            auth: string,
            query: {
                noteId: string,
            },
        },
    },
    '/notes/many': {
        get: {
            return: Array<Note & HasId>,
            auth: string,
            query: {
                bookId?: string,
            },
        },
    },
    '/tags': {
        post: {
            return: boolean,
            auth: string,
            query: {
                bookId: string,
            },
            body: KnownTag,
        },
        delete: {
            return: boolean,
            auth: string,
            query: {
                bookId: string,
                tag: KnownTagName,
            },
        },
    },
    '/history/books': {
        get: {
            return: Page<BookEvent & HasId>,
            auth: string,
            query: {
                page?: number,
            },
        },
        post: {
            return: HasId,
            auth: string,
            query: {
                bookId: string[],
            },
        }
        delete: {
            return: boolean,
            auth: string,
            query: {
                id: string[],
            },
        },
    },
    '/report': {
        post: {
            return: boolean,
            auth: string,
            query: {
                commentId: string,
                kind: IssueReportKind,
            },
        },
    },
};
