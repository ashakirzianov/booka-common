import { PathMethodContract } from './contractTypes';

export type Page<T> = {
    next?: number,
    values: T[],
};
type ArrayType<T> = T extends Array<infer U> ? U : never;
export type Paginate<T extends PathMethodContract> = Omit<T, 'return'> & {
    return: Page<ArrayType<T['return']>>,
    query?: { page?: number },
};
