import { BookRange } from './bookPath';
import { ParagraphNode } from './bookNode';

export type BookId = string;
export type LibraryQuote = {
    bookId: BookId,
    range: BookRange,
};
export type QuoteNode = {
    node: 'lib-quote',
    quote: LibraryQuote,
};
export type EditableNode = QuoteNode | ParagraphNode;
