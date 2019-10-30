import {
    BookPath, BookFragment, Book, BookNode,
    TableOfContents, TableOfContentsItem, Image,
} from '../model';
import { pathLessThan, nodesForRange, nodeForPath, emptyPath } from './bookRange';
import {
    extractNodeText, normalizeNodes, isEmptyContentNode, iterateNodes, nodeLength,
} from './bookNode';
import { extractSpanText } from './span';

export function previewForPath(book: Book, path: BookPath): string | undefined {
    const node = nodeForPath(book.nodes, path);
    return node !== undefined
        ? extractNodeText(node)
        : undefined;
}

export function tocForBook(book: Book): TableOfContents {
    const anchors = Array.from(iterateTocItems(book.nodes));
    const items: TableOfContentsItem[] = anchors;
    return { items };
}
function* iterateTocItems(nodes: BookNode[]): IterableIterator<TableOfContentsItem> {
    for (const [node, nodePath] of iterateNodes(nodes)) {
        if (node.node === 'title') {
            yield {
                path: nodePath,
                title: extractSpanText(node.span),
                level: node.level,
            };
        }
    }
}

export function fragmentForPath(book: Book, path: BookPath, fragmentLength?: number): BookFragment {
    type PathTitle = {
        path: BookPath,
        title: string | undefined,
    };
    let previous: PathTitle | undefined = undefined;
    let current: PathTitle = {
        path: emptyPath(),
        title: book.meta.title,
    };
    let next: PathTitle | undefined = undefined;
    let nodes: BookNode[] = [];
    let currentLength = 0;
    let isUnderTitle = true;
    let isPastCurrent = false;
    for (const [node, currPath] of iterateNodes(book.nodes)) {
        if (node.node !== 'title' || isUnderTitle) {
            nodes.push(node);
            if (isUnderTitle && !isEmptyContentNode(node)) {
                isUnderTitle = false;
            }
            if (fragmentLength) {
                currentLength += nodeLength(node);
            }
            continue;
        }
        const pair: PathTitle = {
            path: currPath,
            title: extractSpanText(node.span),
        };
        isPastCurrent = isPastCurrent || pathLessThan(path, currPath);
        if (isPastCurrent) {
            if (!fragmentLength || currentLength >= fragmentLength) {
                next = pair;
                break;
            } else {
                nodes.push(node);
                currentLength += nodeLength(node);
            }
        } else {
            previous = current;
            current = pair;
            isUnderTitle = true;
            nodes = [];
            currentLength = 0;
        }
    }

    return {
        previous, current, next, nodes,
    };
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
