export type OpenBookEvent = {
    _id: string,
    kind: 'book-open',
    date: Date,
    bookId: string,
};
export type BookEvent = OpenBookEvent;

export type HistoryEvent = OpenBookEvent;
export type HistoryEventKind = HistoryEvent['kind'];
