import {
    Bookmark, BookPath,
    EntityData,
    Highlight,
    CurrentPosition,
    EntitySource,
    BrowserSource,
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
    switch (source.source) {
        case 'app':
            switch (source.kind) {
                case 'ios':
                    return 'iOS';
                case 'android':
                    return 'Android';
                default:
                    assertNever(source.kind);
                    return 'Unknown app';
            }
        case 'browser':
            const suffix = source.mobile === true ? ' Mobile'
                : source.mobile === false ? ' Desktop'
                    : '';
            return `${browserToString(source.kind)}${suffix}`;
        default:
            assertNever(source);
            return 'unknown';
    }
}

function browserToString(browser: BrowserSource['kind']): string {
    switch (browser) {
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
        case 'other':
            return 'Other browser';
        default:
            assertNever(browser);
            return 'Unknown browser';
    }
}
