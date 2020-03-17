import {
    Bookmark, BookPath,
    EntityData,
    Highlight,
    CurrentPosition,
} from '../model';
import { samePath, pathLessThan } from './bookPath';
import { uuid } from './misc';

export function localBookmark(data: EntityData<Bookmark>): Bookmark {
    return {
        uuid: uuid(),
        ...data,
    };
}

export function localHighlight(data: EntityData<Highlight>): Highlight {
    return {
        uuid: uuid(),
        ...data,
    };
}

export function localCurrentPosition(data: EntityData<CurrentPosition>): CurrentPosition {
    return {
        uuid: uuid(),
        ...data,
    };
}

export function findBookmark(bookmarks: Bookmark[], bookId: string, path: BookPath): Bookmark | undefined {
    return bookmarks.find(
        b => b.bookId === bookId && samePath(b.path, path),
    );
}
