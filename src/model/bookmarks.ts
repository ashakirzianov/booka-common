import { BookPositionLocator } from './locator';
import { HasId } from './base';

export type BookmarkSource = string;
export type BookmarkKind = 'manual' | 'current' | 'navigation';
export type BookmarkPost = {
    source: BookmarkSource,
    kind: BookmarkKind,
    location: BookPositionLocator,
    created: Date,
};
export type CurrentBookmarkUpdate = Omit<BookmarkPost, 'kind'>;
export type Bookmark = BookmarkPost & HasId & {
    preview: string,
};
