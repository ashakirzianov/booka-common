import { BookPath, BookPositionLocator } from '../model';

export function pathLocator(bookId: string, path: BookPath): BookPositionLocator {
    return {
        loc: 'book-pos',
        id: bookId,
        path,
    };
}
