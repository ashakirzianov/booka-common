import {
    Node, Span, BookPath, ParagraphNode, HasSubnodes, ImageData, BookFragment, BookContentNode, Semantic,
} from '../model';
import { extractSpanText, normalizeSpan, ImageProcessor, processSpanImages } from './span';
import { addPaths } from './bookRange';
import { assertNever, flatten, assertType } from './misc';

export function assignId<N extends Node>(node: N, refId: string): N {
    return { ...node, refId };
}

export function appendSemantics<N extends Node>(node: N, semantics: Semantic[]): N {
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

export function hasSubnodes(bn: Node): bn is HasSubnodes {
    return bn.node === 'chapter' || bn.node === 'group';
}

export function* iterateBookFragment(fragment: BookFragment): Generator<[BookContentNode, BookPath]> {
    for (const [node, path] of iterateNodes(fragment.nodes)) {
        yield [
            node as BookContentNode,
            addPaths(fragment.current, path),
        ];
    }
}

export function* iterateNodes(nodes: Node[]): Generator<[Node, BookPath]> {
    for (let idx = 0; idx < nodes.length; idx++) {
        const node = nodes[idx];
        yield [node, [idx]];
        if (hasSubnodes(node)) {
            yield* iterateNodes(node.nodes);
        }
    }
}

export function* justNodeGenerator(nodes: Node[]): Generator<Node> {
    for (const node of nodes) {
        yield node;
        if (hasSubnodes(node)) {
            yield* justNodeGenerator(node.nodes);
        }
    }
}

export function* iterateNodeIds(nodes: Node[]): Generator<string> {
    for (const node of justNodeGenerator(nodes)) {
        if (node.refId !== undefined) {
            yield node.refId;
        }
    }
}

export function* iterateReferencedBookIds(nodes: Node[]): Generator<string> {
    for (const subnode of justNodeGenerator(nodes)) {
        if (subnode.node === 'lib-quote') {
            yield subnode.quote.bookId;
        }
    }
}

export function findReference(refId: string, nodes: Node[]): [Node, BookPath] | undefined {
    for (const [sub, path] of iterateNodes(nodes)) {
        if (sub.refId === refId) {
            return [sub, path];
        }
    }
    return undefined;
}
// TODO: re-implement
export function extractNodeText(node: Node): string {
    switch (node.node) {
        case 'chapter':
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
        case 'lib-quote':
            return '';
        default:
            assertNever(node);
            return '';
    }
}

export function extractSpans(node: Node): Span[] {
    switch (node.node) {
        case 'chapter':
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
        case 'lib-quote':
        case 'separator':
            return [];
        default:
            assertNever(node);
            return [];
    }
}

// Process nodes:

export async function processNodesImages(nodes: BookContentNode[], fn: (image: ImageData) => Promise<ImageData>): Promise<BookContentNode[]> {
    return Promise.all(
        nodes.map(n => processNodeImages(n, fn))
    );
}

async function processNodeImages(node: BookContentNode, fn: (image: ImageData) => Promise<ImageData>): Promise<BookContentNode> {
    return processNodeSpansAsync(node, async s => processSpanImages(s, fn));
}

export function normalizeNodes(nodes: BookContentNode[]): BookContentNode[] {
    const results: BookContentNode[] = [];
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

function couldBeNormalized(node: BookContentNode): boolean {
    return node.refId === undefined && (node.semantics === undefined || node.semantics.length === 0);
}

export async function processNodesSpansAsync(nodes: BookContentNode[], fn: (span: Span) => Promise<Span>): Promise<BookContentNode[]> {
    return Promise.all(
        nodes.map(n => processNodeSpansAsync(n, fn))
    );
}

export async function processNodeSpansAsync(node: BookContentNode, fn: (span: Span) => Promise<Span>): Promise<BookContentNode> {
    switch (node.node) {
        case 'pph':
            return {
                ...node,
                span: await fn(node.span),
            };
        case 'group':
        case 'chapter':
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
