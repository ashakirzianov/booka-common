import { HasId } from './base';
import { BookPath } from './bookPath';
import { LibraryCard } from './book';

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
export type Bookmark = BookmarkPost & HasId;

export type ResolvedCurrentBookmark = {
    card: LibraryCard,
    locations: Array<{
        preview: string | undefined,
        source: BookmarkSource,
        path: BookPath,
        created: Date,
    }>,
};
