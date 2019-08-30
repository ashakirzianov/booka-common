import { PathMethodContract } from './contractTypes';

export type HasId = {
    _id: string,
};

export type WithId<T> = T & HasId;

export type Page<T> = {
    next?: number,
    values: T[],
};
type ArrayType<T> = T extends Array<infer U> ? U : never;
export type Paginate<T extends PathMethodContract> = Omit<T, 'return'> & {
    return: Page<ArrayType<T['return']>>,
    query?: { page?: number },
};
