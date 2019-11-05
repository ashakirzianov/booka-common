import {
    BookNode, Span, BookPath, ParagraphNode, BookFragment, NodeFlag,
} from '../model';
import {
    extractSpanText, normalizeSpan, processSpan, processSpanAsync,
    isEmptyContentSpan, iterateSpans, compoundSpan, spanLength,
} from './span';
import { addPaths, appendPath, nodePath } from './bookPath';
import { assertNever, flatten, distinct } from './misc';

export function assignId<N extends BookNode>(node: N, refId: string): N {
    return { ...node, refId };
}

export function flagNode<N extends BookNode>(node: N, ...flags: NodeFlag[]): N {
    return node.flags
        ? { ...node, flags: distinct([...node.flags, ...flags]) }
        : { ...node, flags: distinct(flags) };
}

export function makePph(span: Span): ParagraphNode {
    return {
        node: 'pph',
        span,
    };
}

export function pphSpan(p: ParagraphNode): Span {
    return p.span;
}

export function* iterateBookFragment(fragment: BookFragment): Generator<[BookNode, BookPath]> {
    for (const [node, path] of iterateNodes(fragment.nodes)) {
        yield [
            node as BookNode,
            addPaths(fragment.current.path, path),
        ];
    }
}

export function* iterateNodes(nodes: BookNode[]): Generator<[BookNode, BookPath]> {
    for (let idx = 0; idx < nodes.length; idx++) {
        const node = nodes[idx];
        const headPath = nodePath([idx]);
        yield [node, headPath];
    }
}

export function* iterateNodeSpans(node: BookNode) {
    const spans = nodeSpans(node);
    yield* iterateSpans(spans);
}

export function findReference(nodes: BookNode[], refId: string): [BookNode, BookPath] | undefined {
    for (const [node, path] of iterateNodes(nodes)) {
        for (const nodeRefId of iterateNodeRefIds(node)) {
            if (node.refId === nodeRefId) {
                return [node, path];
            }
        }

        const spans = nodeSpans(node);
        for (const [span, sym] of iterateSpans(spans)) {
            if (span.refId === refId) {
                return [node, appendPath(path, sym)];
            }
        }
    }
    return undefined;
}

export function* iterateNodeRefIds(node: BookNode): Generator<string> {
    if (node.refId !== undefined) {
        yield node.refId;
    }
    switch (node.node) {
        case 'table':
            for (const row of node.rows) {
                if (row.refId !== undefined) {
                    yield row.refId;
                }
                for (const cell of row.cells) {
                    if (cell.refId !== undefined) {
                        yield cell.refId;
                    }
                }
            }
            break;
        case 'list':
            for (const item of node.items) {
                if (item.refId !== undefined) {
                    yield item.refId;
                }
            }
            break;
    }
}

export function extractNodeText(node: BookNode): string {
    return nodeSpans(node)
        .map(extractSpanText)
        .join('\n');
}

export function processNodes(nodes: BookNode[], fn: (node: BookNode) => BookNode): BookNode[] {
    return nodes.map(fn);
}

export async function processNodesAsync(nodes: BookNode[], fn: (node: BookNode) => Promise<BookNode>): Promise<BookNode[]> {
    return Promise.all(nodes.map(fn));
}

export function processNodeSpans(node: BookNode, fn: (s: Span) => Span): BookNode {
    switch (node.node) {
        case 'pph':
        case 'title':
            return {
                ...node,
                span: processSpan(node.span, fn),
            };
        case 'table':
            {
                const rows = node.rows.map(
                    row => ({
                        ...row,
                        cells: row.cells.map(
                            cell => ({
                                ...cell,
                                span: processSpan(cell.span, fn),
                            })
                        ),
                    })
                );
                return { ...node, rows };
            }
        case 'list':
            {
                const items = node.items.map(
                    item => ({
                        ...item,
                        span: processSpan(item.span, fn),
                    })
                );
                return { ...node, items };
            }
        case 'separator':
        case 'image':
        case 'ignore':
            return node;
        default:
            assertNever(node);
            return node;
    }
}

export async function processNodeSpansAsync(node: BookNode, fn: (s: Span) => Promise<Span>): Promise<BookNode> {
    switch (node.node) {
        case 'pph':
        case 'title':
            return {
                ...node,
                span: await processSpanAsync(node.span, fn),
            };
        case 'table':
            {
                const rows = await Promise.all(
                    node.rows.map(
                        async row => ({
                            ...row,
                            cells: await Promise.all(
                                row.cells.map(
                                    async cell => ({
                                        ...cell,
                                        span: await processSpanAsync(cell.span, fn),
                                    }),
                                ),
                            ),
                        })
                    ),
                );
                return { ...node, rows };
            }
        case 'list':
            {
                const items = await Promise.all(
                    node.items.map(
                        async item => ({
                            ...item,
                            span: await processSpanAsync(item.span, fn),
                        }),
                    ),
                );
                return { ...node, items };
            }
        case 'separator':
        case 'image':
        case 'ignore':
            return node;
        default:
            assertNever(node);
            return node;
    }
}

export function normalizeNodes(nodes: BookNode[]): BookNode[] {
    const results: BookNode[] = processNodes(nodes, node => {
        return processNodeSpans(node, normalizeSpan);
    });
    return results;
}

export function isEmptyContentNode(node: BookNode): boolean {
    switch (node.node) {
        case 'title':
        case 'pph':
            return isEmptyContentSpan(node.span);
        case 'table':
            return node.rows.every(
                row => row.cells.every(
                    cell => isEmptyContentSpan(cell.span)
                )
            );
        case 'list':
            return node.items.every(
                item => isEmptyContentSpan(item.span)
            );
        case 'image':
            return false;
        case 'separator':
        case 'ignore':
            return true;
        default:
            assertNever(node);
            return false;
    }
}

export function convertNodeToSpan(node: BookNode): Span {
    const span: Span = { span: 'plain', content: convertNodeToSpanImpl(node) };

    span.refId = node.refId;
    span.flags = node.flags;
    span.title = node.title;

    return span;
}

export function nodeLength(node: BookNode): number {
    const spans = nodeSpans(node);
    const length = spans.reduce((len, s) => len + spanLength(s), 0);
    return length;
}

function convertNodeToSpanImpl(node: BookNode): Span {
    switch (node.node) {
        case 'title':
        case 'pph':
            return node.span;
        case 'list':
            return node.items.reduce(
                (res, i) =>
                    compoundSpan([res, '\n', i.span]),
                [] as Span);
        case 'table':
            return node.rows.reduce(
                (res, row) => {
                    const rowSpan = row.cells.reduce((s, cell) =>
                        compoundSpan([s, ' | ', cell.span]),
                        [] as Span);
                    return compoundSpan([res, '\n', rowSpan]);
                },
                [] as Span,
            );
        case 'image':
            return { span: 'image', image: node.image };
        case 'ignore':
        case 'separator':
            return [];
        default:
            assertNever(node);
            return [];
    }
}

function nodeSpans(node: BookNode): Span[] {
    switch (node.node) {
        case 'title':
        case 'pph':
            return [node.span];
        case 'table':
            return flatten(
                node.rows
                    .map(row => row.cells.map(c => c.span))
            );
        case 'list':
            return node.items.map(i => i.span);
        case 'separator':
        case 'image':
        case 'ignore':
            return [];
        default:
            assertNever(node);
            return [];
    }
}
