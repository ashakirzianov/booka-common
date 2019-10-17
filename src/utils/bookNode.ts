import {
    BookNode, Span, BookPath, ParagraphNode, BookFragment, NodeFlag,
} from '../model';
import {
    extractSpanText, normalizeSpan, processSpan, processSpanAsync,
    visitSpan, isEmptyContentSpan, iterateSpans, compoundSpan,
} from './span';
import { addPaths, appendPath, nodePath } from './bookRange';
import { assertNever, flatten, filterUndefined, distinct } from './misc';

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

export function nodeSpans(node: BookNode): Span[] {
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

export function* iterateBookFragment(fragment: BookFragment): Generator<[BookNode, BookPath]> {
    for (const [node, path] of iterateNodes(fragment.nodes)) {
        yield [
            node as BookNode,
            addPaths(fragment.current, path),
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

export function* iterateNodeIds(nodes: BookNode[]): Generator<string> {
    for (const [node] of iterateNodes(nodes)) {
        if (node.refId !== undefined) {
            yield node.refId;
        }
    }
}

export function findReference(nodes: BookNode[], refId: string): [BookNode, BookPath] | undefined {
    for (const [node, path] of iterateNodes(nodes)) {
        for (const nodeRefId of iterateNodeRefIds(node)) {
            if (node.refId === refId) {
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

export function extractRefsFromNodes(nodes: BookNode[]): string[] {
    const results = visitNodes(nodes, {
        span: s => {
            switch (s.spanKind) {
                case 'ref':
                    return s.refToId;
                default:
                    return undefined;
            }
        },
    });
    return filterUndefined(results);
}

export function extractNodeText(node: BookNode): string {
    return nodeSpans(node)
        .map(extractSpanText)
        .join('\n');
}

// Process nodes:

export type VisitNodesArgs<T> = {
    node?: (n: BookNode) => T,
    span?: (s: Span) => T,
};
export function visitNodes<T>(nodes: BookNode[], args: VisitNodesArgs<T>): T[] {
    const results: T[] = [];
    for (const node of nodes) {
        if (args.span) {
            const spans = nodeSpans(node);
            const spanProc = args.span;
            const fromSpans = flatten(spans.map(s => visitSpan(s, spanProc)));
            results.push(...fromSpans);
        }
        if (args.node) {
            results.push(args.node(node));
        }
    }

    return results;
}

export type ProcessNodesArgs = {
    node?: (n: BookNode) => (BookNode | undefined),
    span?: (s: Span) => Span,
};
export function processNodes(nodes: BookNode[], args: ProcessNodesArgs): BookNode[] {
    const results: BookNode[] = [];
    for (const node of nodes) {
        let curr: BookNode | undefined = node;
        switch (curr.node) {
            case 'pph':
            case 'title':
                if (args.span) {
                    const span = processSpan(curr.span, args.span);
                    curr = { ...curr, span };
                }
                break;
            case 'table':
                if (args.span) {
                    const spanProc = args.span;
                    const rows = curr.rows.map(
                        row => ({
                            ...row,
                            cells: row.cells.map(
                                cell => ({
                                    ...cell,
                                    span: processSpan(cell.span, spanProc),
                                })
                            ),
                        })
                    );
                    curr = { ...curr, rows };
                }
                break;
            case 'list':
                if (args.span) {
                    const spanProc = args.span;
                    const items = curr.items.map(
                        item => ({
                            ...item,
                            span: processSpan(item.span, spanProc),
                        })
                    );
                    curr = { ...curr, items };
                }
                break;
            case 'separator':
            case 'image':
            case 'ignore':
                break;
            default:
                assertNever(curr);
                break;
        }
        if (args.node) {
            curr = args.node(curr);
        }
        if (curr !== undefined) {
            results.push(curr);
        }
    }

    return results;
}

export type ProcessNodesAsyncArgs = {
    node?: (n: BookNode) => Promise<BookNode | undefined>,
    span?: (s: Span) => Promise<Span>,
};
export async function processNodesAsync(nodes: BookNode[], args: ProcessNodesAsyncArgs): Promise<BookNode[]> {
    const results: BookNode[] = [];
    for (const node of nodes) {
        let curr: BookNode | undefined = node;
        switch (curr.node) {
            case 'pph':
            case 'title':
                if (args.span) {
                    const span = await processSpanAsync(curr.span, args.span);
                    curr = { ...curr, span };
                }
                break;
            case 'table':
                if (args.span) {
                    const spanProc = args.span;
                    const rows = await Promise.all(
                        curr.rows.map(
                            async row => ({
                                ...row,
                                cells: await Promise.all(
                                    row.cells.map(
                                        async cell => ({
                                            ...cell,
                                            span: await processSpanAsync(cell.span, spanProc),
                                        }),
                                    ),
                                ),
                            })
                        ),
                    );
                    curr = { ...curr, rows };
                }
                break;
            case 'list':
                if (args.span) {
                    const spanProc = args.span;
                    const items = await Promise.all(
                        curr.items.map(
                            async item => ({
                                ...item,
                                span: await processSpanAsync(item.span, spanProc),
                            }),
                        ),
                    );
                    curr = { ...curr, items };
                }
                break;
            case 'separator':
            case 'image':
            case 'ignore':
                break;
            default:
                assertNever(curr);
                break;
        }
        if (args.node) {
            curr = await args.node(curr);
        }
        if (curr !== undefined) {
            results.push(curr);
        }
    }

    return results;
}

export function normalizeNodes(nodes: BookNode[]): BookNode[] {
    const results: BookNode[] = [];
    for (const node of nodes) {
        switch (node.node) {
            case 'title':
            case 'pph':
                {
                    const span = normalizeSpan(node.span);
                    results.push({
                        ...node,
                        span,
                    });
                }
                break;
            default:
                results.push(node);
                break;
        }
    }
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
    const span: Span = { spanKind: 'span', span: convertNodeToSpanImpl(node) };

    span.refId = node.refId;
    span.flags = node.flags;
    span.title = node.title;

    return span;
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
            return { spanKind: 'image-span', image: node.image };
        case 'ignore':
        case 'separator':
            return [];
        default:
            assertNever(node);
            return [];
    }
}
