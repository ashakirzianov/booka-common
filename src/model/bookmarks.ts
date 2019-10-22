import { BookPositionLocator } from './locator';

export type BookmarkSource = string;
export type BookmarkKind = 'manual' | 'current' | 'navigation';
export type Bookmark = {
    _id: string,
    source: BookmarkSource,
    kind: BookmarkKind,
    location: BookPositionLocator,
    created: Date,
};
export type BookmarkUpdate = Pick<Bookmark, 'source' | 'created' | 'location'>;
