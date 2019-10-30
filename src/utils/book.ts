import {
    BookPath, BookFragment, Book, BookNode,
    TableOfContents, TableOfContentsItem, Image, BookAnchor,
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
    const items: TableOfContentsItem[] = [];
    let position: number = 0;
    for (const [node, nodePath] of iterateNodes(book.nodes)) {
        if (node.node === 'title') {
            items.push({
                path: nodePath,
                title: extractSpanText(node.span),
                level: node.level,
                position,
            });
        }
        position += nodeLength(node);
    }

    return {
        items,
        length: position,
    };
}

export function fragmentForPath(book: Book, path: BookPath, fragmentLength?: number): BookFragment {
    let previous: BookAnchor | undefined = undefined;
    let current: BookAnchor = {
        path: emptyPath(),
        title: book.meta.title,
        position: 0,
    };
    let next: BookAnchor | undefined = undefined;
    let nodes: BookNode[] = [];
    let currentPosition = 0;
    let currentLength = 0;
    let isUnderTitle = true;
    let isPastCurrent = false;
    for (const [node, currPath] of iterateNodes(book.nodes)) {
        const length = nodeLength(node);
        if (node.node !== 'title' || isUnderTitle) {
            nodes.push(node);
            if (isUnderTitle && !isEmptyContentNode(node)) {
                isUnderTitle = false;
            }
            if (fragmentLength) {
                currentLength += length;
            }
            continue;
        }
        const anchor: BookAnchor = {
            path: currPath,
            title: extractSpanText(node.span),
            position: currentPosition,
        };
        currentPosition += length;
        isPastCurrent = isPastCurrent || pathLessThan(path, currPath);
        if (isPastCurrent) {
            if (!fragmentLength || currentLength >= fragmentLength) {
                next = anchor;
                break;
            } else {
                nodes.push(node);
                currentLength += nodeLength(node);
            }
        } else {
            previous = current;
            current = anchor;
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
