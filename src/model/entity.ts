import { BookPath, BookRange } from './bookPath';
import { EditableNode } from './editable';

type DefEntity<Key extends string> = {
    uuid: string,
};

export type BrowserSource = {
    source: 'browser',
    browser: 'safari' | 'chrome' | 'fire-fox' | 'edge' | 'ie' | 'other',
    mobile?: boolean,
};
export type AppSource = {
    source: 'app',
    app: 'ios' | 'android',
};
export type EntitySource = BrowserSource | AppSource;

export type CurrentPosition = DefEntity<'current-position'> & {
    source: EntitySource,
    bookId: string,
    path: BookPath,
    created: Date,
};
export type CurrentPositionPost = EntityData<CurrentPosition>;

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
export type HighlightPost = Highlight;
export type HighlightUpdate = EntityId<Highlight> & Partial<Highlight>;

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
