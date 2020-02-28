import { BookPath, BookRange } from './bookPath';
import { EditableNode } from './editable';
import { LibraryCard } from './card';

type DefEntity<Key extends string> = {
    entity: Key,
    _id: string,
    local?: true,
};

export type BookmarkSource = string;
export type BookmarkKind = 'manual' | 'current' | 'navigation';
export type Bookmark = DefEntity<'bookmark'> & {
    source: BookmarkSource,
    kind: BookmarkKind,
    location: {
        bookId: string,
        path: BookPath,
    },
    created: Date,
};

export type Highlight = DefEntity<'highlight'> & {
    group: string,
    location: {
        bookId: string,
        range: BookRange,
    },
    comment?: EditableNode[],
};

export type CommentTargetLocator = {
    target: 'pph',
    bookId: string,
    path: BookPath,
} | {
    target: 'comment',
    commentId: string,
};
export type CommentKind = 'question' | 'statement';
export type Comment = DefEntity<'comment'> & {
    kind: CommentKind,
    content: EditableNode[],
    target: CommentTargetLocator,
    children: Comment[],
    rating: number,
    lastEdited: Date,
};

export type VoteKind = 'like' | 'dislike';
export type Vote = DefEntity<'vote'> & {
    kind: VoteKind,
    commentId: string,
};

export type Entity =
    | Bookmark | Highlight | Comment | Vote
    ;

// TODO: rethink
export type ResolvedCurrentBookmark = {
    card: LibraryCard,
    locations: Array<{
        preview: string | undefined,
        source: BookmarkSource,
        path: BookPath,
        created: Date,
    }>,
};
