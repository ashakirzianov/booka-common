import {
    Bookmark, BookPath, ResolvedCurrentPosition, BookPositionData,
    EntityData, EntityKind, EntityForKind,
} from '../model';
import { samePath, pathLessThan } from './bookPath';
import { uuid } from './misc';

function makeLocalEntityConstructor<K extends EntityKind>(entity: K) {
    return (data: EntityData): EntityForKind<K> => ({
        entity,
        uuid: uuid(),
        ...data,
    } as any);
}
export const localBookmark = makeLocalEntityConstructor('bookmark');
export const localHighlight = makeLocalEntityConstructor('highlight');
export const localCurrentPosition = makeLocalEntityConstructor('current-position');

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
