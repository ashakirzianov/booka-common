import { BookPath } from './bookRange';

export type BookmarkSource = string;
export type BookmarkKind = 'manual' | 'current' | 'navigation';
export type Bookmark = {
    source: BookmarkSource,
    kind: BookmarkKind,
    location: BookPath,
    created: Date,
};
