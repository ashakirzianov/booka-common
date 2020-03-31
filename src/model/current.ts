import { DefEntity, EntityData } from './base';
import { BookPath } from './bookPath';

export type BrowserSource = {
    source: 'browser',
    kind: 'safari' | 'chrome' | 'firefox' | 'edge' | 'ie' | 'other',
    mobile?: boolean,
};
export type AppSource = {
    source: 'app',
    kind: 'ios' | 'android',
    mobile?: undefined,
};
export type EntitySource = BrowserSource | AppSource;

export type CurrentPosition = DefEntity<'current-position'> & {
    source: EntitySource,
    bookId: string,
    path: BookPath,
    created: Date,
};
export type CurrentPositionPost = EntityData<CurrentPosition>;
