import { DefEntity, EntityData } from './base';
import { BookPath } from './bookPath';

export type BrowserSource = {
    source: 'browser',
    browser: 'safari' | 'chrome' | 'fire-fox' | 'edge' | 'ie' | 'other',
    mobile?: boolean,
};
export type AppSource = {
    source: 'app',
    app: 'ios' | 'android',
};
export type EntitySource = BrowserSource | AppSource;

export type CurrentPosition = DefEntity<'current-position'> & {
    source: EntitySource,
    bookId: string,
    path: BookPath,
    created: Date,
};
export type CurrentPositionPost = EntityData<CurrentPosition>;
