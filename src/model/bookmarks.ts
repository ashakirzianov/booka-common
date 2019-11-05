import { HasId } from './base';
import { BookPath } from './bookRange';

export type BookmarkSource = string;
export type BookmarkKind = 'manual' | 'current' | 'navigation';
export type BookmarkPost = {
    source: BookmarkSource,
    kind: BookmarkKind,
    location: {
        bookId: string,
        path: BookPath,
    },
    created: Date,
};
export type CurrentBookmarkUpdate = Omit<BookmarkPost, 'kind'>;
export type Bookmark = BookmarkPost & HasId & {
    preview: string,
};
