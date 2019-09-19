export function assertNever<T = void>(x: never, handle: (x: unknown) => T): T;
export function assertNever<T = void>(x: never): undefined;
export function assertNever<T = void>(x: never, handle?: (x: unknown) => T): T | undefined {
    if (handle) {
        return handle(x);
    }
    return undefined;
}

export function assertNeverAndThrow(x: never, message?: string): never {
    throw new Error(message || `Unexpected value: '${x}'`);
}

export function filterUndefined<T>(arr: Array<T | undefined>): T[] {
    return arr.filter((x): x is T => x !== undefined);
}

export function filterNullable<T>(arr: Array<T | undefined | null>): T[] {
    return arr.filter((x): x is T => x !== undefined && x !== null);
}

export function flatten<T>(arrArr: T[][]): T[] {
    return arrArr.reduce((acc, arr) => acc.concat(arr), []);
}

type ObjectMap<V, K extends PropertyKey = string> = {
    [k in K]?: V;
};
export function values<V>(obj: ObjectMap<V>): V[] {
    return Object.values(obj) as any;
}

export function forEach<V>(obj: ObjectMap<V>, f: (key: string, value: V) => void) {
    return Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (value !== undefined) {
            f(key, value);
        }
    });
}

export function last<T>(arr: T[]): T {
    return arr[arr.length - 1];
}

export function distinct<T>(arr: T[]): T[] {
    return arr.reduce<T[]>((res, x) => {
        if (!res.some(xx => xx === x)) {
            res.push(x);
        }

        return res;
    }, []);
}
