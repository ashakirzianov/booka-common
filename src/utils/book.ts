import {
    BookPath, BookFragment, Book, BookContentNode,
    TableOfContents, TableOfContentsItem,
} from '../model';
import { pathLessThan, nodesForRange } from './bookRange';
import { extractNodeText, normalizeNodes } from './nodes';

export function tocForBook(book: Book): TableOfContents {
    const anchors = Array.from(iterateAnchorPaths(book.volume.nodes, [], false));
    const items: TableOfContentsItem[] = anchors;
    return { items };
}

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
    for (const { path: anchor } of iterateAnchorPaths(nodes)) {
        if (pathLessThan(path, anchor)) {
            next = anchor;
            break;
        }
        previous = current;
        current = anchor;
    }

    return { previous, current, next };
}

type Anchor = {
    path: BookPath,
    title: string[],
    level: number,
};
// TODO: re-implement
function* iterateAnchorPaths(nodes: BookContentNode[], prefix: BookPath = [], skipFirstChapters: boolean = true): IterableIterator<Anchor> {
    for (let idx = 0; idx < nodes.length; idx++) {
        const node = nodes[idx];
        if (node.node === 'chapter') {
            const chapterPrefix = [...prefix, idx];
            // Skip first subchapters -- merge with parents
            if (!skipFirstChapters || idx !== 0) {
                yield {
                    path: chapterPrefix,
                    title: node.title,
                    level: node.level,
                };
            }
            yield* iterateAnchorPaths(node.nodes, chapterPrefix, skipFirstChapters);
        } else if (node.node === 'title') {
            const chapterPrefix = [...prefix, idx];
            // Skip first subchapters -- merge with parents
            if (!skipFirstChapters || idx !== 0) {
                yield {
                    path: chapterPrefix,
                    title: node.lines,
                    level: node.level,
                };
            }
        }
    }
}

export function extractBookText(book: Book): string {
    return book.volume.nodes
        .map(extractNodeText)
        .join('');
}

export function normalizeBook(book: Book): Book {
    return {
        ...book,
        volume: {
            ...book.volume,
            nodes: normalizeNodes(book.volume.nodes),
        },
    };
}
