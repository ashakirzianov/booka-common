import { BookPath, BookRange } from '../model';
import { compare } from './misc';

export function firstPath(): BookPath {
    return nodePath(0);
}

export function nodePath(node: number, span?: number): BookPath {
    return { node };
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

export function addPaths(path: BookPath, toAdd: BookPath): BookPath {
    return {
        node: path.node + toAdd.node,
    };
}

export function pathWithSpan(path: BookPath, span: number): BookPath {
    return { ...path, span };
}

export function relativePath(path: BookPath, relativeTo: BookPath): BookPath | undefined {
    if (relativeTo.node > path.node) {
        return undefined;
    } else if (relativeTo.span !== undefined) {
        if (path.span === undefined || relativeTo.span > path.span) {
            return undefined;
        } else {
            return {
                node: path.node - relativeTo.node,
                span: path.span - relativeTo.span,
            };
        }
    } else {
        return {
            node: path.node - relativeTo.node,
            span: path.span,
        };
    }
}

export function rangeRelativeToPath(range: BookRange, relativeTo: BookPath): BookRange | undefined {
    const start = relativePath(range.start, relativeTo);
    if (start) {
        const end = range.end && relativePath(range.end, relativeTo);
        return { start, end };
    } else {
        return undefined;
    }
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

export function isOverlap(left: BookRange, right: BookRange): boolean {
    const [first, second] = pathLessThan(left.start, right.start)
        ? [left, right]
        : [right, left];

    return first.end === undefined || !pathLessThan(first.end, second.start);
}

export function pathToString(path: BookPath) {
    return path.span === undefined
        ? `${path.node}`
        : `${path.node}@${path.span}`;
}

export function pathFromString(pathString: string): BookPath | undefined {
    const comps = pathString
        .split('@')
        .map(c => parseInt(c, 10));
    if (comps.length === 1 || comps.length === 2) {
        return comps.every(c => !isNaN(c))
            ? nodePath(comps[0], comps[1])
            : undefined;
    } else {
        return undefined;
    }
}

export function rangeToString(range: BookRange): string {
    return `${pathToString(range.start)}_${range.end ? pathToString(range.end) : ''}`;
}

export function rangeFromString(rangeString: string): BookRange | undefined {
    const paths = rangeString.split('_');
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
