import {
    Bookmark, BookPath, ResolvedCurrentPosition, BookPositionData,
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

type LocationsData = {
    mostRecent: BookPositionData,
    furthest: BookPositionData,
};
export function getLocationsData(resolvedPosition: ResolvedCurrentPosition): LocationsData | undefined {
    let result: LocationsData | undefined = undefined;
    for (const location of resolvedPosition.locations) {
        if (!result) {
            result = { mostRecent: location, furthest: location };
        } else {
            result = {
                mostRecent: result.mostRecent.created > location.created
                    ? result.mostRecent : location,
                furthest: pathLessThan(result.mostRecent.path, location.path)
                    ? result.mostRecent : location,
            };
        }
    }
    return result;
}
