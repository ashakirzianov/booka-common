export function assertType<T>(x: T) {
    return;
}

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

export function lastElement<T>(arr: T[]): T {
    return arr[arr.length - 1];
}

export function distinct<T>(arr: T[], eq?: (l: T, r: T) => boolean): T[] {
    return arr.reduce<T[]>((res, x) => {
        const pred = eq
            ? (xx: T) => eq(xx, x)
            : (xx: T) => xx === x;
        if (!res.some(pred)) {
            res.push(x);
        }

        return res;
    }, []);
}

export type TypeGuard<T extends X, X = any> = (x: X) => x is T;
export function guard<T extends X, X = any>(g: (x: X) => boolean): TypeGuard<T, X> {
    return g as any;
}

export function definedKeys(obj: any): string[] {
    const keys: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
            keys.push(key);
        }
    }

    return keys;
}
