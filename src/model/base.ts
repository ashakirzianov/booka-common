// TODO: remove ?
export type HasId = {
    _id: string,
};

export type DefEntity<Key extends string> = {
    uuid: string,
};

export type EntityData<T> = Omit<T, 'uuid'>;
export type EntityId = DefEntity<any>;
