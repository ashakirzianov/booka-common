export function assertNever(x: never, handle?: (x: unknown) => void) {
    if (handle) {
        handle(x);
    }
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
