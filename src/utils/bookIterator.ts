import { BookContentNode, VolumeNode, BookPath } from '../model';
import { pathHead, appendPath, pathTail, emptyPath } from './bookRange';
import { nodeChildren } from './nodes';

export type RootIterator = {
    node: undefined,
    firstChildren: BookIteratorHandler,
};
export type BookIterator = {
    node: BookContentNode,
    index: number,
    parent: ParentIterator,
    prevSibling: BookIteratorHandler,
    nextSibling: BookIteratorHandler,
    firstChildren: BookIteratorHandler,
};
export type OptBookIterator = BookIterator | undefined;
export type ParentIterator = RootIterator | BookIterator;
export type OptParentIterator = ParentIterator | undefined;
type BookIteratorHandler = () => OptBookIterator;

export function bookIterator(book: VolumeNode): RootIterator {
    const p = {
        node: undefined,
        firstChildren: undefined as any,
    };
    p.firstChildren = siblingIterator(p, book.nodes, 0);
    return p;
}

export function iterateToPath(iterator: ParentIterator, path: BookPath): OptBookIterator {
    const head = pathHead(path);
    if (head === undefined) {
        return iterator.node ? iterator : undefined;
    } else {
        const next = nthSibling(iterator.firstChildren(), head);
        const tail = pathTail(path);
        return next ? iterateToPath(next, tail) : undefined;
    }
}

export function iterateUntilCan(iterator: ParentIterator, path: BookPath): OptParentIterator {
    const head = pathHead(path);
    if (head === undefined) {
        return iterator.node ? iterator : undefined;
    } else {
        const next = nthSibling(iterator.firstChildren(), head);
        const tail = pathTail(path);
        return next ? iterateUntilCan(next, tail) : iterator;
    }
}

export function nthSibling(iterator: OptBookIterator, n: number): OptBookIterator {
    if (!iterator || n === 0) {
        return iterator;
    } else {
        return n > 0
            ? nthSibling(iterator.nextSibling(), n - 1)
            : nthSibling(iterator.prevSibling(), n + 1);
    }
}

function siblingIterator(parent: ParentIterator, siblings: BookContentNode[], idx: number): BookIteratorHandler {
    return () => {
        if (idx < siblings.length && idx >= 0) {
            const node = siblings[idx];
            const iterator: BookIterator = {
                node,
                index: idx,
                parent: parent,
                nextSibling: siblingIterator(parent, siblings, idx + 1),
                prevSibling: siblingIterator(parent, siblings, idx - 1),
                firstChildren: () => undefined,
            };

            const ch = nodeChildren(node);
            if (ch.length > 0) {
                iterator.firstChildren = siblingIterator(iterator, ch, 0);
            }

            return iterator;
        } else {
            return undefined;
        }
    };
}

export function nextIterator(i: OptParentIterator): OptBookIterator {
    if (!i || !i.node) {
        return undefined;
    }
    const nextSibling = i.nextSibling();
    if (nextSibling) {
        return nextSibling;
    } else {
        return nextIterator(i.parent);
    }
}

export function prevIterator(i: OptParentIterator): OptBookIterator {
    if (!i || !i.node) {
        return undefined;
    }
    const prevSibling = i.prevSibling();
    if (prevSibling) {
        return prevSibling;
    } else {
        return prevIterator(i.parent);
    }
}

export function nextChapter(i: OptParentIterator): OptParentIterator {
    let next = nextIterator(i);
    while (next && next.node.node !== 'chapter') {
        next = nextIterator(next);
    }

    return next;
}

export function buildPath(i: OptParentIterator): BookPath {
    return i && i.node ? appendPath(buildPath(i.parent), i.index) : emptyPath();
}
