import {
    Node, Span, BookPath, ParagraphNode, HasSubnodes, ImageData, BookFragment, BookContentNode, Semantic,
} from '../model';
import { extractSpanText, normalizeSpan } from './span';
import { addPaths } from './bookRange';
import { assertNever, flatten } from './misc';

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
    return bn.node === 'chapter' || bn.node === 'volume' || bn.node === 'group';
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

export function* iterateImageIds(nodes: Node[]): Generator<string> {
    for (const node of justNodeGenerator(nodes)) {
        switch (node.node) {
            case 'image':
                yield node.image.imageId;
                continue;
            case 'volume':
                if (node.meta.coverImage) {
                    yield node.meta.coverImage.imageId;
                }
                continue;
            default:
                continue;
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
        case 'volume':
        case 'group':
            return node.nodes
                .map(extractNodeText)
                .join('\n');
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
        case 'image':
        case 'lib-quote':
            return '';
        default:
            assertNever(node);
            return '';
    }
}

export function extractSpans(node: Node): Span[] {
    switch (node.node) {
        case 'volume':
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
        case 'image':
        case 'lib-quote':
        case 'separator':
            return [];
        default:
            assertNever(node);
            return [];
    }
}

// Process nodes:

export async function processNodeImagesAsync<N extends Node>(n: N, f: (image: ImageData) => Promise<ImageData>): Promise<N> {
    let node = n as Node;
    switch (node.node) {
        case 'volume':
            if (node.meta.coverImage) {
                const processed = await f(node.meta.coverImage);
                node = {
                    ...node,
                    meta: {
                        ...node.meta,
                        coverImage: processed,
                    },
                };
            }
        case 'chapter':
        case 'group':
            const nodes = await Promise.all(
                node.nodes.map(nn => processNodeImagesAsync(nn, f))
            );
            node = {
                ...node,
                nodes: nodes,
            };
            break;
        case 'image':
            const image = await f(node.image);
            node = {
                ...node,
                image,
            };
            break;
    }

    return node as N;
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
