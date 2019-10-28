import {
    BookPath, BookFragment, Book, BookNode,
    TableOfContents, TableOfContentsItem, Image,
} from '../model';
import { pathLessThan, nodesForRange, nodeForPath } from './bookRange';
import {
    extractNodeText, normalizeNodes, isEmptyContentNode,
} from './bookNode';
import { extractSpanText } from './span';

export function previewForPath(book: Book, path: BookPath): string | undefined {
    const node = nodeForPath(book.nodes, path);
    return node !== undefined
        ? extractNodeText(node)
        : undefined;
}

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

function* iterateAnchorPaths(nodes: BookNode[], prefix: BookPath = [], skipFirstChapters: boolean = true): IterableIterator<Anchor> {
    let underTitle = false;
    for (let idx = 0; idx < nodes.length; idx++) {
        const node = nodes[idx];
        if (node.node === 'title') {
            const chapterPrefix = [...prefix, idx];
            // Skip first subchapters -- merge with parents
            if (!skipFirstChapters || !underTitle) {
                yield {
                    path: chapterPrefix,
                    title: extractSpanText(node.span),
                    level: node.level,
                };
            }
            underTitle = true;
        } else if (!isEmptyContentNode(node)) {
            underTitle = false;
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

export function getCoverBase64(book: Book): string | undefined {
    const coverImage = book.meta.coverImage;
    if (coverImage === undefined) {
        return undefined;
    }
    if (coverImage.image === 'buffer') {
        return coverImage.base64;
    } else {
        const resolved = book.images[coverImage.imageId];
        if (resolved !== undefined && resolved.image === 'buffer') {
            return resolved.base64;
        } else {
            return undefined;
        }
    }
}
