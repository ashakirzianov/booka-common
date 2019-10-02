import { BookPath, BookFragment, Book, BookContentNode, BookRange } from '../model';
import { pathLessThan, nodesForRange } from './bookRange';

export function fragmentForPath(book: Book, path: BookPath): BookFragment {
    const { previous, current, next } = buildAnchorsForPath(book, path);
    const range = {
        start: current,
        end: next,
    };
    const nodes = nodesForRange(book.volume.nodes, range);

    return {
        previous, current, next, nodes,
    };
}

function buildAnchorsForPath(book: Book, path: BookPath) {
    let previous: BookPath | undefined = undefined;
    let current: BookPath = [];
    let next: BookPath | undefined = undefined;
    const nodes = book.volume.nodes;
    for (const anchor of iterateAnchorPaths(nodes, [])) {
        if (pathLessThan(path, anchor)) {
            next = anchor;
            break;
        }
        previous = current;
        current = anchor;
    }

    return { previous, current, next };
}

function* iterateAnchorPaths(nodes: BookContentNode[], prefix: BookPath): IterableIterator<BookPath> {
    for (let idx = 0; idx < nodes.length; idx++) {
        const node = nodes[idx];
        if (node.node === 'chapter') {
            const chapterPrefix = [...prefix, idx];
            // Skip first subchapters -- merge with parents
            if (idx !== 0) {
                yield chapterPrefix;
            }
            yield* iterateAnchorPaths(node.nodes, chapterPrefix);
        }
    }
}
