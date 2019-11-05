import { BookPath, BookRange, BookNodePath } from '../model';
import { compare } from './misc';

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

export function comparePaths(left?: BookPath, right?: BookPath): number {
    const nodeResult = compare(left?.node, right?.node);
    return nodeResult === 0
        ? compare(left?.span, right?.span)
        : nodeResult;
}

export function pathLessThan(left: BookPath, right: BookPath): boolean {
    return comparePaths(left, right) === -1;
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
