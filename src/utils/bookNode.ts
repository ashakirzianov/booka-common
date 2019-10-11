import {
    BookNode, Span, BookPath, ParagraphNode, HasSubnodes, ImageData, BookFragment, Semantic,
} from '../model';
import { extractSpanText, normalizeSpan, processSpan, processSpanAsync, mapSpan, imageSpan } from './span';
import { addPaths } from './bookRange';
import { assertNever, flatten } from './misc';

export function assignId<N extends BookNode>(node: N, refId: string): N {
    return { ...node, refId };
}

export function appendSemantics<N extends BookNode>(node: N, semantics: Semantic[]): N {
    return node.semantics
        ? { ...node, semantics: [...node.semantics, ...semantics] }
        : { ...node, semantics: semantics };
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

export function hasSubnodes(bn: BookNode): bn is HasSubnodes {
    return bn.node === 'group';
}

export function getSubnodes(bn: BookNode): BookNode[] {
    return hasSubnodes(bn)
        ? bn.nodes
        : [];
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
        yield [node, [idx]];
        if (hasSubnodes(node)) {
            yield* iterateNodes(node.nodes);
        }
    }
}

export function* justNodeGenerator(nodes: BookNode[]): Generator<BookNode> {
    for (const node of nodes) {
        yield node;
        if (hasSubnodes(node)) {
            yield* justNodeGenerator(node.nodes);
        }
    }
}

export function* iterateNodeIds(nodes: BookNode[]): Generator<string> {
    for (const node of justNodeGenerator(nodes)) {
        if (node.refId !== undefined) {
            yield node.refId;
        }
    }
}

export function findReference(refId: string, nodes: BookNode[]): [BookNode, BookPath] | undefined {
    for (const [sub, path] of iterateNodes(nodes)) {
        if (sub.refId === refId) {
            return [sub, path];
        }
    }
    return undefined;
}
// TODO: re-implement
export function extractNodeText(node: BookNode): string {
    switch (node.node) {
        case 'group':
            return node.nodes
                .map(extractNodeText)
                .join('');
        case undefined:
            return extractSpanText(node);
        case 'pph':
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
        case 'title':
            return node.lines.join('\n');
        case 'separator':
            return '';
        default:
            assertNever(node);
            return '';
    }
}

export function extractSpans(node: BookNode): Span[] {
    switch (node.node) {
        case 'group':
            return flatten(node.nodes.map(extractSpans));
        case undefined:
            return [node];
        case 'pph':
            return [node.span];
        case 'table':
            return flatten(flatten(
                node.rows.map(r => r.cells.map(c => c.spans))
            ));
        case 'list':
            return flatten(
                node.items.map(i => i.spans)
            );
        case 'title':
            return node.lines;
        case 'separator':
            return [];
        default:
            assertNever(node);
            return [];
    }
}

// Process nodes:

export type ProcessNodesArgs = {
    node?: (n: BookNode) => (BookNode | undefined),
    span?: (s: Span) => Span,
};
export function processNodes(nodes: BookNode[], args: ProcessNodesArgs): BookNode[] {
    const results: BookNode[] = [];
    for (const node of nodes) {
        let curr: BookNode | undefined = node;
        switch (curr.node) {
            case 'group':
                {
                    const processed = processNodes(curr.nodes, args);
                    curr = { ...curr, nodes };
                }
                break;
            case 'pph':
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
            case 'title':
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
            case 'group':
                {
                    const processed = await processNodesAsync(curr.nodes, args);
                    curr = { ...curr, nodes: processed };
                }
                break;
            case 'pph':
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
            case 'title':
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

export type ImageProcessor = (image: ImageData) => Promise<ImageData>;
export async function processNodesImages(nodes: BookNode[], fn: (image: ImageData) => Promise<ImageData>): Promise<BookNode[]> {
    return processNodesAsync(nodes, {
        span: s => mapSpan(s, {
            image: async data => imageSpan(await fn(data)),
            default: async ss => ss,
        }),
    });
}

export function normalizeNodes(nodes: BookNode[]): BookNode[] {
    const results: BookNode[] = [];
    for (const node of nodes) {
        switch (node.node) {
            case 'pph':
                {
                    const span = normalizeSpan(node.span);
                    results.push({
                        ...node,
                        span,
                    });
                }
                break;
            case 'group':
                {
                    const normalized = normalizeNodes(node.nodes);
                    if (couldBeNormalized(node)) {
                        results.push(...normalized);
                    } else {
                        results.push({
                            ...node,
                            nodes: normalized,
                        });
                    }
                }
                break;
            default:
                results.push(node);
                break;
        }
    }
    return results;
}

function couldBeNormalized(node: BookNode): boolean {
    return node.refId === undefined && (node.semantics === undefined || node.semantics.length === 0);
}

export async function processNodesSpansAsync(nodes: BookNode[], fn: (span: Span) => Promise<Span>): Promise<BookNode[]> {
    return Promise.all(
        nodes.map(n => processNodeSpansAsync(n, fn))
    );
}

export async function processNodeSpansAsync(node: BookNode, fn: (span: Span) => Promise<Span>): Promise<BookNode> {
    switch (node.node) {
        case 'pph':
            return {
                ...node,
                span: await fn(node.span),
            };
        case 'group':
            return {
                ...node,
                nodes: await processNodesSpansAsync(node.nodes, fn),
            };
        case 'table':
            return {
                ...node,
                rows: await Promise.all(
                    node.rows.map(async row => ({
                        ...row,
                        cells: await Promise.all(
                            row.cells.map(async cell => ({
                                ...cell,
                                spans: await Promise.all(
                                    cell.spans.map(fn)
                                ),
                            }))
                        ),
                    }))
                ),
            };
        case 'list':
            return {
                ...node,
                items: await Promise.all(
                    node.items.map(async item => ({
                        ...item,
                        spans: await Promise.all(
                            item.spans.map(fn)
                        ),
                    }))
                ),
            };
        case 'separator':
        case 'title':
            return node;
        default:
            assertNever(node);
            return node;
    }
}
