import {
    Book, BookDesc, BookEvent, BookPositionLocator,
    AuthToken, AccountInfo,
    Highlight, HighlightUpdate, HighlightPost,
    Bookmark, BookmarkUpdate,
    Comment, CommentPost, CommentUpdate,
    NotePost, Note, NoteUpdate,
    Vote, VotePost,
    IssueReportPost,
    KnownTag, KnownTagName,
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
    '/books/single': {
        get: {
            return: Book,
            query: { id: string },
        },
    },
    '/books/all': {
        get: Paginate<{
            return: BookDesc[],
        }>,
    },
    '/books/upload': {
        post: {
            return: string,
            files: 'book',
            auth: string,
        },
    },
    '/books': {
        get: Paginate<{
            return: BookDesc[],
            auth: string,
            query: {
                tags?: string[],
            },
        }>,
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
            return: HasId[],
            auth: string,
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
            body: BookmarkUpdate,
        },
    },
    '/comments': {
        get: {
            return: Comment[],
            body: BookPositionLocator,
        },
        post: {
            return: HasId,
            auth: string,
            body: CommentPost,
        },
        patch: {
            return: boolean,
            auth: string,
            body: CommentUpdate,
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
            body: VotePost,
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
    '/notes/single': {
        get: {
            return: Note,
            auth: string,
            query: {
                noteId: string,
            },
        },
    },
    '/notes/many': {
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
    '/history/books': {
        get: Paginate<{
            return: BookEvent[],
            auth: string,
            query: {
                page?: number,
            },
        }>,
        post: {
            return: boolean,
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
            body: IssueReportPost,
        },
    },
};
