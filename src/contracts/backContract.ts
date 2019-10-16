import {
    Book, Highlight, Bookmark,
    AuthToken, AccountInfo,
    Comment, CommentLocation, CommentData, Vote, VoteKind,
    NoteData, Note, BookDesc, IssueReportKind,
} from '../model';
import { HasId, Paginate } from './helpers';
import { KnownTag, KnownTagName } from '../model/tag';
import { BookEvent } from '../model/history';

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
            return: Bookmark[],
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
            return: Comment[],
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
