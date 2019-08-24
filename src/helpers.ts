export type HasId = {
    id: string,
};

export type WithId<T> = T & HasId;
