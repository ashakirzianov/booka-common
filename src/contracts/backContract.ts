import {
    Book, Highlight, Bookmark,
    AuthToken, AccountInfo,
    Comment, CommentPost, Vote, VoteKind,
    NoteData, Note, BookDesc, IssueReportKind,
    KnownTag, KnownTagName, BookEvent, BookmarkUpdate, BookPositionLocator, CommentUpdate, ResolvedVote,
} from '../model';
import { HasId, Paginate } from './helpers';

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
            query: {
                commentId: string,
            },
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
    '/subcomments': {
        post: {
            return: HasId,
            auth: string,
            query: {
                commentId: string,
            },
            body: CommentPost,
        },
    },
    '/votes': {
        get: Paginate<{
            return: ResolvedVote[],
            auth: string,
            query: {
                bookId?: string,
            },
        }>,
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
            query: {
                commentId: string,
                kind: IssueReportKind,
            },
        },
    },
};
