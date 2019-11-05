export type BookNodePath = {
    node: number,
};
export type BookPath = BookNodePath & {
    span?: number,
};

export type BookRange = {
    start: BookPath,
    end?: BookPath,
};
