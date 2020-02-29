import { BookPath, BookRange } from './bookPath';
import { EditableNode } from './editable';
import { LibraryCard } from './card';

type DefEntity<Key extends string> = {
    entity: Key,
    _id: string,
    local?: true,
};

export type EntitySource = string;

export type CurrentPosition = DefEntity<'current-position'> & {
    source: EntitySource,
    bookId: string,
    path: BookPath,
    created: Date,
};
export type ResolvedCurrentPosition = CurrentPosition & {
    card: LibraryCard,
    preview: string,
};

export type Bookmark = DefEntity<'bookmark'> & {
    bookId: string,
    path: BookPath,
};

export type Highlight = DefEntity<'highlight'> & {
    group: string,
    bookId: string,
    range: BookRange,
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
    | Bookmark | CurrentPosition | Highlight | Comment | Vote
    ;

export type EntityData<E extends Entity = Entity> = Omit<E, keyof DefEntity<any>>;
export type EntityId<E extends Entity = Entity> = Pick<E, keyof DefEntity<any>>;
