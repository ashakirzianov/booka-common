import {
    BookEvent,
    AuthToken, AccountInfo,
    Highlight, HighlightUpdate, HighlightPost,
    Bookmark, CurrentBookmarkUpdate, BookmarkPost,
    Comment, CommentPost, CommentUpdate,
    NotePost, Note, NoteUpdate,
    Vote, VotePost,
    IssueReportKind,
    KnownTag, KnownTagName,
    HasId,
    ResolvedCurrentBookmark,
    CardCollection,
    CardCollectionName,
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
    '/bookmarks/current': {
        get: {
            return: ResolvedCurrentBookmark[],
            auth: string,
        },
        put: {
            return: HasId,
            auth: string,
            body: CurrentBookmarkUpdate,
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
    '/history/books': {
        get: Paginate<{
            return: BookEvent[],
            auth: string,
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
                kind: IssueReportKind,
                commentId: string,
            },
        },
    },
};
