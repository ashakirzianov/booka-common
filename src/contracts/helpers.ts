export type HasId = {
    _id: string,
};

export type WithId<T> = T & HasId;

export type Page<T> = {
    next?: number,
    values: T[],
};
