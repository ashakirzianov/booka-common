import {
    BookEvent,
    AuthToken, AccountInfo,
    Highlight, HighlightPost, HighlightUpdate,
    Bookmark, BookmarkPost,
    CurrentPositionPost, ResolvedCurrentPosition,
    Comment, Vote,
    NotePost, Note, NoteUpdate,
    IssueReportKind,
    KnownTag, KnownTagName,
    CardCollection, CardCollectionName,
    HasId,
} from '../model';
import { Paginate } from './helpers';

export type BackContract = {
    '/auth/fbtoken': {
        get: {
            return: AuthToken,
            query: { token: string },
        },
    },
    '/me/info': { get: { return: AccountInfo, auth: string } },
    '/highlights': {
        get: {
            return: Highlight[],
            auth: string,
            query: {
                bookId: string,
            },
        },
        post: {
            return: HasId,
            auth: string,
            body: HighlightPost,
        },
        patch: {
            return: boolean,
            auth: string,
            body: HighlightUpdate,
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
            return: Bookmark[],
            auth: string,
            query: {
                bookId: string,
            },
        },
        post: {
            return: HasId,
            auth: string,
            body: BookmarkPost,
        },
        delete: {
            return: boolean,
            auth: string,
            query: {
                id: string,
            },
        },
    },
    '/current-position': {
        get: {
            return: ResolvedCurrentPosition[],
            auth: string,
        },
        put: {
            return: HasId,
            auth: string,
            body: CurrentPositionPost,
        },
    },
    '/collections': {
        get: {
            return: CardCollection[],
            auth: string,
        },
        post: {
            query: {
                bookId: string,
                collection: CardCollectionName,
            },
            return: boolean,
            auth: string,
        },
        delete: {
            query: {
                bookId: string,
                collection: CardCollectionName,
            },
            return: boolean,
            auth: string,
        },
    },
    '/comments': {
        get: {
            return: Comment[],
            query: {
                id: string,
                path: string,
            },
        },
        post: {
            return: HasId,
            auth: string,
            body: Comment,
        },
        patch: {
            return: boolean,
            auth: string,
            body: Comment,
        },
        delete: {
            return: boolean,
            auth: string,
            query: {
                commentId: string,
            },
        },
    },
    '/votes': {
        get: Paginate<{
            return: Vote[],
            auth: string,
            query: {
                bookId?: string,
            },
        }>,
        post: {
            return: HasId,
            auth: string,
            body: Vote,
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
            body: NotePost,
        },
        patch: {
            return: boolean,
            auth: string,
            body: NoteUpdate,
        },
        delete: {
            return: boolean,
            auth: string,
            query: {
                noteId: string,
            },
        },
    },
    '/notes/id': {
        get: {
            return: Note,
            auth: string,
            query: {
                noteId: string,
            },
        },
    },
    '/notes/book': {
        get: {
            return: Note[],
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
    '/report': {
        post: {
            return: boolean,
            auth: string,
            query: {
                kind: IssueReportKind,
                commentId: string,
            },
        },
    },
};
