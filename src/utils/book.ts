import {
    BookPath, BookFragment, Book, BookNode,
    TableOfContents, TableOfContentsItem, BookAnchor,
} from '../model';
import { pathLessThan, firstPath, inRange } from './bookPath';
import {
    extractNodeText, normalizeNodes, isEmptyContentNode,
    iterateNodes, nodeLength,
} from './bookNode';
import { extractSpanText } from './span';

export function isPathInFragment(fragment: BookFragment, path: BookPath) {
    return !pathLessThan(path, fragment.current.path)
        && (
            fragment.next === undefined || pathLessThan(path, fragment.next.path)
        );
}

export function nodeForPath(book: Book, path: BookPath): BookNode | undefined {
    if (book.nodes.length <= path.node) {
        return undefined;
    } else {
        return book.nodes[path.node];
    }
}

export function fragmentNodeForPath(fragment: BookFragment, path: BookPath): BookNode | undefined {
    if (!inRange(path, {
        start: fragment.current.path,
        end: fragment.next?.path,
    })) {
        return undefined;
    }

    const offset = path.node - fragment.current.path.node;
    return fragment.nodes[offset];
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
        title: book.meta.title,
        items,
        length: position,
    };
}

export const defaultFragmentLength = 1500;
export function fragmentForPath(book: Book, path: BookPath, fragmentLength?: number): BookFragment {
    let previous: BookAnchor | undefined = undefined;
    let current: BookAnchor = {
        path: firstPath(),
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
            if (isUnderTitle && !isEmptyContentNode(node) && node.node !== 'title') {
                isUnderTitle = false;
            }
            currentLength += length;
            currentPosition += length;
            continue;
        }
        const anchor: BookAnchor = {
            path: currPath,
            title: extractSpanText(node.span),
            position: currentPosition,
        };
        currentPosition += length;
        isUnderTitle = true;
        isPastCurrent = isPastCurrent || pathLessThan(path, currPath);
        if (isPastCurrent) {
            if (!fragmentLength || currentLength >= fragmentLength) {
                next = anchor;
                break;
            } else {
                nodes.push(node);
                currentLength += length;
            }
        } else {
            previous = current;
            current = anchor;
            nodes = [node];
            currentLength = length;
        }
    }

    return {
        previous, current, next, nodes,
    };
}

export function fullBookFragment(book: Book): BookFragment {
    return {
        current: {
            path: firstPath(),
            title: book.meta.title,
            position: 0,
        },
        nodes: book.nodes,
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
