export type OpenBookEvent = {
    kind: 'book-open',
    date: Date,
    bookId: string,
};

export type HistoryEvent = OpenBookEvent;
export type HistoryEventKind = HistoryEvent['kind'];
