import { BookPath, BookRange } from './bookPath';
import { EditableNode } from './editable';
import { LibraryCard } from './card';

type DefEntity<Key extends string> = {
    uuid: string,
};

export type EntitySource = string;

export type CurrentPosition = DefEntity<'current-position'> & {
    source: EntitySource,
    bookId: string,
    path: BookPath,
    created: Date,
};
export type CurrentPositionPost = CurrentPosition;
export type BookPositionData = {
    source: EntitySource,
    path: BookPath,
    created: Date,
    preview?: string,
};
export type ResolvedCurrentPosition = {
    card: LibraryCard,
    locations: BookPositionData[],
};

export type Bookmark = DefEntity<'bookmark'> & {
    bookId: string,
    path: BookPath,
};
export type BookmarkPost = Bookmark;

export type HighlightGroup = string;
export type Highlight = DefEntity<'highlight'> & {
    group: HighlightGroup,
    bookId: string,
    range: BookRange,
    comment?: EditableNode[],
};
export type HighlightPost = EntityData<'highlight'>;
export type HighlightUpdate = Partial<Highlight>;

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

export type EntityData<T> = Omit<T, 'uuid'>;
export type EntityId<E extends Entity = Entity> = Pick<E, keyof DefEntity<any>>;
