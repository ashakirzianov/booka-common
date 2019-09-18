export type PromiseType<T> = T extends Promise<infer U> ? U : any;

export type ExcludeKeys<T, K extends PropertyKey> = Pick<T, Exclude<keyof T, K>>;

export type Func<Argument, Return> =
    | void extends Argument ? () => Return
    : undefined extends Argument ? (payload?: Argument) => Return
    : (payload: Argument) => Return
    ;
export type Callback<Argument = void> = Func<Argument, void>;
