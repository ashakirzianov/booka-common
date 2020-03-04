import { BookPath, BookRange, BookNodePath } from '../model';

export function firstPath(): BookPath {
    return bookPath(0);
}

export function nodePath(node: number): BookNodePath {
    return { node };
}

export function bookPath(node: number, span?: number): BookPath {
    return { node, span };
}

export function sameNode(p1: BookPath, p2: BookPath): boolean {
    return p1.node === p2.node;
}

export function samePath(p1: BookPath, p2: BookPath) {
    return sameNode(p1, p2) && p1.span === p2.span;
}

export function comparePaths(left: BookPath, right: BookPath): number {
    if (left.node === right.node) {
        return (left.span ?? 0) - (right.span ?? 0);
    } else {
        return left.node - right.node;
    }
}

export function pathLessThan(left: BookPath, right: BookPath): boolean {
    return comparePaths(left, right) < 0;
}

export function addNodePaths(path: BookNodePath, toAdd: BookNodePath): BookPath {
    return {
        node: path.node + toAdd.node,
    };
}

export function pathWithSpan(path: BookPath, span: number): BookPath {
    return { ...path, span };
}

export function bookRange(start?: BookPath, end?: BookPath): BookRange {
    return {
        start: start || firstPath(),
        end: end,
    };
}

export function bookRangeUnordered(f: BookPath, s: BookPath): BookRange {
    if (pathLessThan(s, f)) {
        return bookRange(s, f);
    } else {
        return bookRange(f, s);
    }
}

export function inRange(path: BookPath, range: BookRange): boolean {
    return !pathLessThan(path, range.start)
        && (!range.end || pathLessThan(path, range.end));
}

export function doesRangeOverlap(r1: BookRange, r2: BookRange): boolean {
    if (pathLessThan(r1.start, r2.start)) {
        return r1.end
            ? !pathLessThan(r1.end, r2.start)
            : true;
    } else {
        return r2.end
            ? !pathLessThan(r2.end, r1.start)
            : true;
    }
}

const spanSeparator = '-';
export function pathToString(path: BookPath) {
    return path.span === undefined
        ? `${path.node}`
        : `${path.node}${spanSeparator}${path.span}`;
}

export function pathFromString(pathString: string): BookPath | undefined {
    const comps = pathString
        .split(spanSeparator)
        .map(c => parseInt(c, 10));
    if (comps.length === 1 || comps.length === 2) {
        return comps.every(c => !isNaN(c))
            ? bookPath(comps[0], comps[1])
            : undefined;
    } else {
        return undefined;
    }
}

const rangeSeparator = 'to';
export function rangeToString(range: BookRange): string {
    return `${pathToString(range.start)}${rangeSeparator}${range.end ? pathToString(range.end) : ''}`;
}

export function rangeFromString(rangeString: string): BookRange | undefined {
    const paths = rangeString.split(rangeSeparator);
    if (paths.length !== 2) {
        return undefined;
    }
    const start = pathFromString(paths[0]);
    if (start === undefined) {
        return undefined;
    }
    const end = pathFromString(paths[1]);
    return { start, end };
}
