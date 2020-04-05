import { BookPath } from './bookPath';

export type Bookmark = {
    uuid: string,
    bookId: string,
    path: BookPath,
};
export type BookmarkPost = Bookmark;
