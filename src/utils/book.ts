import {
    BookPath, BookFragment, Book, BookNode,
    TableOfContents, TableOfContentsItem, ImageData,
} from '../model';
import { pathLessThan, nodesForRange } from './bookRange';
import { extractNodeText, normalizeNodes, processNodesImages } from './bookNode';
import { ImageProcessor } from './span';

export async function processBookImages(book: Book, fn: ImageProcessor): Promise<Book> {
    if (book.meta.coverImage) {
        const processed = await fn(book.meta.coverImage);
        book = {
            ...book,
            meta: {
                ...book.meta,
                coverImage: processed,
            },
        };
    }
    book = {
        ...book,
        nodes: await processNodesImages(book.nodes, fn),
    };
    return book;
}

export async function storeImages(book: Book, fn: (buffer: Buffer, imageId: string) => Promise<string | undefined>): Promise<Book> {
    const store: {
        [key: string]: ImageData | undefined,
    } = {};

    return processBookImages(book, async imageData => {
        if (imageData.kind === 'ref') {
            return imageData;
        }
        const stored = store[imageData.imageId];
        if (stored !== undefined) {
            return stored;
        } else {
            const url = await fn(imageData.buffer, imageData.imageId);
            if (url !== undefined) {
                const result: ImageData = {
                    ...imageData,
                    kind: 'ref',
                    ref: url,
                };
                store[imageData.imageId] = result;
                return result;
            } else {
                return imageData;
            }
        }
    });
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
    title: string[],
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
                    title: node.lines,
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
