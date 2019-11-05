export type BookPath = {
    node: number,
    span?: number,
};

export type BookRange = {
    start: BookPath,
    end?: BookPath,
};
