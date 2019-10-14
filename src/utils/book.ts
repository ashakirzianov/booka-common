import {
    BookPath, BookFragment, Book, BookNode,
    TableOfContents, TableOfContentsItem, Image,
} from '../model';
import { pathLessThan, nodesForRange } from './bookRange';
import {
    extractNodeText, normalizeNodes,
} from './bookNode';
import { extractSpanText } from './span';

export function tocForBook(book: Book): TableOfContents {
    const anchors = Array.from(iterateAnchorPaths(book.nodes, [], false));
    const items: TableOfContentsItem[] = anchors;
    return { items };
}

export function fragmentForPath(book: Book, path: BookPath): BookFragment {
    const { previous, current, next } = buildAnchorsForPath(book, path);
    const range = {
        start: current,
        end: next,
    };
    const nodes = nodesForRange(book.nodes, range);

    return {
        previous, current, next, nodes,
    };
}

function buildAnchorsForPath(book: Book, path: BookPath) {
    let previous: BookPath | undefined = undefined;
    let current: BookPath = [];
    let next: BookPath | undefined = undefined;
    const nodes = book.nodes;
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
    title: string,
    level: number,
};
// TODO: re-implement
function* iterateAnchorPaths(nodes: BookNode[], prefix: BookPath = [], skipFirstChapters: boolean = true): IterableIterator<Anchor> {
    for (let idx = 0; idx < nodes.length; idx++) {
        const node = nodes[idx];
        if (node.node === 'title') {
            const chapterPrefix = [...prefix, idx];
            // Skip first subchapters -- merge with parents
            if (!skipFirstChapters || idx !== 0) {
                yield {
                    path: chapterPrefix,
                    title: extractSpanText(node.span),
                    level: node.level,
                };
            }
        }
    }
}

export function extractBookText(book: Book): string {
    return book.nodes
        .map(extractNodeText)
        .join('');
}

export function normalizeBook(book: Book): Book {
    return {
        ...book,
        nodes: normalizeNodes(book.nodes),
    };
}
