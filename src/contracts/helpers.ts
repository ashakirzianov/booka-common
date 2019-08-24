export type HasId = {
    _id: string,
};

export type WithId<T> = T & HasId;
