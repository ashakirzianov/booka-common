import { BookPath } from './bookPath';

export type EntitySourceKind =
    | 'safari' | 'chrome' | 'firefox' | 'edge' | 'ie' | 'other-browser'
    | 'native-ios' | 'native-android'
    | 'unknown'
    ;
export type EntitySource = {
    id: string,
    kind: EntitySourceKind,
    mobile?: boolean,
    version?: string,
};

export type CurrentPosition = {
    source: EntitySource,
    bookId: string,
    path: BookPath,
    created: Date,
};
