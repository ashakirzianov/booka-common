import { Book, BookPath, BookFragment, BookRange } from '../model';
import { iterateNodes, nodeLength, extractNodeText } from './bookNode';
import { isPathInFragment, fragmentNodeForPath } from './book';
import { pathLessThan } from './bookPath';

export function bookLength(book: Book): number {
    let result = 0;
    for (const [n] of iterateNodes(book.nodes)) {
        result += nodeLength(n);
    }

    return result;
}

export const pageLength = 1500;
export function pageForPosition(position: number): number {
    return Math.floor(position / pageLength) + 1;
}

export function previewForPath(book: Book, path: BookPath): string | undefined {
    if (book.nodes.length < path.node) {
        return undefined;
    }
    const previewLength = 1500;
    let preview = '';
    for (let nodeIdx = path.node; nodeIdx < book.nodes.length; nodeIdx++) {
        const node = book.nodes[nodeIdx];
        preview += extractNodeText(node) + '\n';
        if (preview.length > previewLength) {
            break;
        }
    }

    return preview;
}

export function fragmentTextForRange(fragment: BookFragment, range: BookRange): string | undefined {
    const firstNode = fragmentNodeForPath(fragment, range.start);
    if (!firstNode) {
        return undefined;
    }
    const firstNodeText = extractNodeText(firstNode);
    if (range.start.node === range.end?.node) {
        return firstNodeText.substring(
            range.start.span ?? 0,
            range.end?.span ?? 0,
        );
    }
    const { nodes, current } = fragment;
    let result = firstNodeText.substring(range.start.span ?? 0);
    const lastMiddle = range.end
        ? Math.min(nodes.length, range.end.node - current.path.node)
        : nodes.length;
    for (let idx = 0; idx < lastMiddle; idx++) {
        const nodeText = extractNodeText(nodes[idx]);
        result += nodeText;
    }
    const end = range.end && range.end.node - current.path.node;
    if (end && end < nodes.length) {
        const endNode = nodes[end];
        const endText = extractNodeText(endNode);
        result += endText.substring(0, range.end?.span);
    }

    return result;
}
