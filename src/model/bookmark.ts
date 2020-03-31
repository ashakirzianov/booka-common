import { DefEntity } from './base';
import { BookPath } from './bookPath';

export type Bookmark = DefEntity<'bookmark'> & {
    bookId: string,
    path: BookPath,
};
export type BookmarkPost = Bookmark;
