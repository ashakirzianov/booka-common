import {
    Bookmark, Highlight, CurrentPosition, BookPath, EntityData,
    EntitySource, EntitySourceKind,
} from '../model';
import { samePath } from './bookPath';
import { uuid, assertNever } from './misc';

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

export function sourceToString(source: EntitySource): string {
    const mobileSuffix = source.mobile === true ? ' Mobile'
        : source.mobile === false ? ' Desktop'
            : '';
    const versionSuffix = source.version
        ? ` ${source.version}`
        : '';
    const result = `${kindToString(source.kind)}${mobileSuffix}${versionSuffix}`;
    return result;
}

function kindToString(kind: EntitySourceKind): string {
    switch (kind) {
        case 'chrome':
            return 'Chrome';
        case 'safari':
            return 'Safari';
        case 'firefox':
            return 'Firefox';
        case 'edge':
            return 'Edge';
        case 'ie':
            return 'Internet Explorer';
        case 'other-browser':
            return 'Other browser';
        case 'native-android':
            return 'Android';
        case 'native-ios':
            return 'iOS';
        case 'unknown':
            return 'Unknown';
        default:
            assertNever(kind);
            return 'Unsupported';
    }
}
