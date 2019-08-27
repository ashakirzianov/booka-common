export type OpenBookEvent = {
    kind: 'book-open',
    date: Date,
    bookId: string,
};
export type BookEvent = OpenBookEvent;

export type HistoryEvent = OpenBookEvent;
export type HistoryEventKind = HistoryEvent['kind'];
