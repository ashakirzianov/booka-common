import { BookPath, BookRange, BookNode } from '../model';
import { lastElement } from './misc';

export function leadPath(head: number): BookPath {
    return [head];
}

export function emptyPath(): BookPath {
    return [];
}

export function pathHead(path: BookPath): number | undefined {
    return path[0];
}

export function pathTail(path: BookPath) {
    return path.slice(1);
}

export function parentPath(path: BookPath) {
    return path.slice(0, path.length - 1);
}

export function incrementPath(path: BookPath, inc: number): BookPath {
    const result = path.slice();
    result[path.length - 1] += inc;

    return result;
}

export function appendPath(path: BookPath, lastIdx: number): BookPath {
    return path.concat([lastIdx]);
}

export function concatPath(path: BookPath, tail: BookPath): BookPath {
    return path.concat(tail);
}

export function addPaths(path: BookPath, toAdd: BookPath): BookPath {
    if (toAdd.length === 0) {
        return path;
    }
    const result = [...path];
    result[result.length - 1] += toAdd[0];
    return [...result, ...toAdd.slice(1)];
}

export function subtractPaths(path: BookPath, toSubtract: BookPath): BookPath | undefined {
    if (path.length < toSubtract.length) {
        return undefined;
    }

    const result = [...path];
    for (let idx = toSubtract.length - 1; idx >= 0; idx--) {
        const resultIdx = idx + result.length - toSubtract.length;
        result[resultIdx] -= toSubtract[idx];
        if (result[resultIdx] < 0) {
            return undefined;
        }
    }

    return result;
}

export function samePath(p1: BookPath, p2: BookPath) {
    return p1.length === p2.length
        && p1.every((p1c, idx) => p1c === p2[idx])
        ;
}

export function sameParent(p1: BookPath, p2: BookPath) {
    return p1.length === p2.length
        && p1.every((p1c, idx) => p1c === p2[idx] || idx === p1.length - 1)
        ;
}

export function comparePaths(left?: BookPath, right?: BookPath): number {
    if (left === undefined) {
        return right === undefined ? 0 : 1;
    } else if (right === undefined) {
        return -1;
    }
    for (let idx = 0; idx < right.length; idx++) {
        const leftElement = left[idx];
        const rightElement = right[idx];
        if (leftElement === undefined) {
            return rightElement === undefined
                ? 0
                : -1;
        }
        if (leftElement !== rightElement) {
            return leftElement < rightElement
                ? -1
                : +1;
        }
    }

    return 0;
}

export function pathLessThan(left: BookPath, right: BookPath): boolean {
    return comparePaths(left, right) === -1;
}

export function isSiblingPaths(left: BookPath, right: BookPath): boolean {
    return left.length === right.length
        && left
            .every((lc, idx) => lc === right[idx] || idx === left.length - 1);
}

export function isSubpath(path: BookPath, sub: BookPath) {
    if (path.length <= sub.length) {
        return path.every((p, i) => p === sub[i]);
    } else {
        return false;
    }
}

export function isFirstSubpath(left: BookPath, right: BookPath) {
    if (!isSubpath(left, right)) {
        return false;
    }

    return right
        .slice(left.length)
        .every(p => p === 0);
}

export function relativePath(path: BookPath, relativeTo: BookPath): BookPath | undefined {
    if (relativeTo.length === 0) {
        return path;
    }
    if (!isSubpath(relativeTo.slice(0, relativeTo.length - 1), path)) {
        return undefined;
    }
    const result = path.slice(relativeTo.length - 1);
    result[0] -= relativeTo[relativeTo.length - 1];
    return result[0] < 0
        ? undefined
        : result;
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

export function nodeForPath(nodes: BookNode[], path: BookPath): BookNode | undefined {
    if (path.length === 0) {
        return undefined;
    }
    const head = nodes[path[0]];
    if (path.length === 0) {
        return head;
    } else {
        return undefined;
    }
}

export function nodesAfterPath(top: BookNode[], path: BookPath, count?: number): BookNode[] {
    if (path.length === 0) {
        const start = 0;
        const end = count === undefined
            ? undefined
            : start + count;
        return top.slice(start, end);
    } else if (path.length === 1) {
        const start = path[0];
        const end = count === undefined
            ? undefined
            : start + count;
        return top.slice(start, end);
    } else {
        return [];
    }
}

export function nodesForRange(nodes: BookNode[], range: BookRange): BookNode[] {
    if (!range.end) {
        return nodesAfterPath(nodes, range.start);
    }

    if (isSiblingPaths(range.start, range.end)) {
        const count = lastElement(range.end) - lastElement(range.start);
        const forPath = nodesAfterPath(nodes, range.start);
        return forPath.slice(0, count);
    } else if (isSubpath(range.start, range.end)) {
        const forPath = nodesAfterPath(nodes, range.start);
        const headNode = forPath[0];
        return [headNode];
    } else if (range.end && !pathLessThan(range.start, range.end)) {
        return [];
    } else {
        return nodesAfterPath(nodes, range.start);
    }
}

export function bookRange(start?: BookPath, end?: BookPath): BookRange {
    return {
        start: start || [],
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

export function subpathCouldBeInRange(path: BookPath, range: BookRange): boolean {
    if (range.end && !pathLessThan(path, range.end)) {
        return false;
    }

    const part = range.start.slice(0, path.length);
    const could = !pathLessThan(path, part);
    return could;
}

export function isOverlap(left: BookRange, right: BookRange): boolean {
    const [first, second] = pathLessThan(left.start, right.start)
        ? [left, right]
        : [right, left];

    return first.end === undefined || !pathLessThan(first.end, second.start);
}
