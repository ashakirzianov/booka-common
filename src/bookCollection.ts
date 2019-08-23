export type BookInfo = {
    id: string,
    title: string,
    author?: string,
    cover?: string,
};

export type BookCollection = {
    books: BookInfo[],
};
