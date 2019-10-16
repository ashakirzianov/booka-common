import {
    BookNode, Span, BookPath, ParagraphNode, BookFragment, Semantic,
} from '../model';
import {
    extractSpanText, normalizeSpan, processSpan, processSpanAsync,
    mapSpan, visitSpan, findAnchor, isEmptyContentSpan,
} from './span';
import { addPaths, appendPath, leadPath } from './bookRange';
import { assertNever, flatten, filterUndefined, distinct } from './misc';

export function assignId<N extends BookNode>(node: N, refId: string): N {
    return { ...node, refId };
}

export function appendSemantics<N extends BookNode>(node: N, semantics: Semantic[]): N {
    return node.semantics
        ? { ...node, semantics: distinct([...node.semantics, ...semantics]) }
        : { ...node, semantics: distinct(semantics) };
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
            addPaths(fragment.current, path),
        ];
    }
}

export function* iterateNodes(nodes: BookNode[]): Generator<[BookNode, BookPath]> {
    for (let idx = 0; idx < nodes.length; idx++) {
        const node = nodes[idx];
        const headPath = leadPath(idx);
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
    for (const [sub, path] of iterateNodes(nodes)) {
        if (sub.refId === refId) {
            return [sub, path];
        } else {
            switch (sub.node) {
                case 'title':
                case 'pph':
                    {
                        const sym = findAnchor([sub.span], refId);
                        if (sym !== undefined) {
                            return [sub, appendPath(path, sym)];
                        }
                    }
                    break;
                case 'table':
                    {
                        for (const row of sub.rows) {
                            for (const cell of row.cells) {
                                const sym = findAnchor(cell.spans, refId);
                                if (sym !== undefined) {
                                    return [sub, appendPath(path, sym)];
                                }
                            }
                        }
                    }
                    break;
                case 'list':
                    {
                        for (const item of sub.items) {
                            const sym = findAnchor(item.spans, refId);
                            if (sym !== undefined) {
                                return [sub, appendPath(path, sym)];
                            }
                        }
                    }
                    break;
                case 'separator':
                    break;
                default:
                    assertNever(sub);
                    break;
            }
        }
    }
    return undefined;
}

export function extractRefsFromNodes(nodes: BookNode[]): string[] {
    const results = visitNodes(nodes, {
        span: s => mapSpan(s, {
            complex: (_, data) => data.refToId,
            default: () => undefined,
        }),
    });
    return filterUndefined(results);
}

export function extractNodeText(node: BookNode): string {
    switch (node.node) {
        case 'pph':
        case 'title':
            return extractSpanText(node.span);
        case 'table':
            return node.rows
                .map(row =>
                    row.cells.map(cell =>
                        cell.spans.map(extractSpanText).join('')
                    )
                        .join('\n')
                )
                .join('\n');
        case 'list':
            return node.items
                .map(i =>
                    i.spans.map(extractSpanText).join('')
                )
                .join('\n');
        case 'separator':
            return '';
        default:
            assertNever(node);
            return '';
    }
}

export function extractSpans(node: BookNode): Span[] {
    switch (node.node) {
        case 'pph':
        case 'title':
            return [node.span];
        case 'table':
            return flatten(flatten(
                node.rows.map(r => r.cells.map(c => c.spans))
            ));
        case 'list':
            return flatten(
                node.items.map(i => i.spans)
            );
        case 'separator':
            return [];
        default:
            assertNever(node);
            return [];
    }
}

// Process nodes:

export type VisitNodesArgs<T> = {
    node?: (n: BookNode) => T,
    span?: (s: Span) => T,
};
export function visitNodes<T>(nodes: BookNode[], args: VisitNodesArgs<T>): T[] {
    const results: T[] = [];
    for (const node of nodes) {
        switch (node.node) {
            case 'pph':
            case 'title':
                if (args.span) {
                    results.push(...visitSpan(node.span, args.span));
                }
                break;
            case 'table':
                if (args.span) {
                    const spanProc = args.span;
                    const fromRows = flatten(
                        node.rows.map(row =>
                            flatten(
                                row.cells.map(cell =>
                                    flatten(
                                        cell.spans.map(s =>
                                            visitSpan(s, spanProc)),
                                    ))
                            ),
                        ),
                    );
                    results.push(...fromRows);
                }
                break;
            case 'list':
                if (args.span) {
                    const spanProc = args.span;
                    const fromItems = flatten(
                        node.items.map(item =>
                            flatten(
                                item.spans.map(s => visitSpan(s, spanProc))
                            ),
                        ),
                    );
                    results.push(...fromItems);
                }
                break;
            case 'separator':
                break;
            default:
                assertNever(node);
                break;
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
                                    spans: cell.spans.map(s => processSpan(s, spanProc)),
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
                            spans: item.spans.map(s => processSpan(s, spanProc)),
                        })
                    );
                    curr = { ...curr, items };
                }
                break;
            case 'separator':
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
                                            spans: await Promise.all(
                                                cell.spans.map(s => processSpanAsync(s, spanProc))
                                            ),
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
                                spans: await Promise.all(
                                    item.spans.map(s => processSpanAsync(s, spanProc)),
                                ),
                            }),
                        ),
                    );
                    curr = { ...curr, items };
                }
                break;
            case 'separator':
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
                    cell => cell.spans.every(isEmptyContentSpan)
                )
            );
        case 'list':
            return node.items.every(
                item => item.spans.every(isEmptyContentSpan)
            );
        case 'separator':
            return true;
        default:
            assertNever(node);
            return false;
    }
}
