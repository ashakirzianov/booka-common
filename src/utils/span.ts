import {
    Span, CompoundSpan, SimpleSpan, SingleSpan,
} from '../model';
import { assertNever, flatten } from './misc';

export function compoundSpan(spans: Span[]): Span {
    return spans;
}

export function isSimpleSpan(span: Span): span is SimpleSpan {
    return typeof span === 'string';
}

export function isCompoundSpan(span: Span): span is CompoundSpan {
    return Array.isArray(span);
}

export function isSingleSpan(span: Span): span is SingleSpan {
    return !isCompoundSpan(span);
}

export function visitSpan<T>(span: Span, visitor: (s: Span) => T): T[] {
    const insideSpans = containedSpans(span);
    const inside = flatten(
        insideSpans.map(s => visitSpan(s, visitor))
    );
    return [...inside, visitor(span)];
}

function containedSpans(span: Span): Span[] {
    switch (span.node) {
        case 'big': case 'bold': case 'italic': case 'quote':
        case 'ref': case 'ruby': case 'small': case 'span':
        case 'sub': case 'sup':
            return [span.span];
        case 'image-span':
            return [];
        case undefined:
            if (isSimpleSpan(span)) {
                return [];
            } else if (isCompoundSpan(span)) {
                return span;
            }
        default:
            assertNever(span);
            return [];
    }
}

export function processSpan(span: Span, fn: (s: Span) => Span): Span {
    const inside = processContainedSpans(span, fn);
    return fn(inside);
}

function processContainedSpans(span: Span, fn: (s: Span) => Span): Span {
    switch (span.node) {
        case 'big': case 'bold': case 'italic': case 'quote':
        case 'ref': case 'ruby': case 'small': case 'span':
        case 'sub': case 'sup':
            return {
                ...span,
                span: processSpan(span.span, fn),
            };
        case 'image-span':
            return span;
        case undefined:
            if (isSimpleSpan(span)) {
                return span;
            } else if (isCompoundSpan(span)) {
                return span.map(s => processSpan(s, fn));
            }
        default:
            assertNever(span);
            return span;
    }
}

export async function processSpanAsync(span: Span, fn: (s: Span) => Promise<Span>): Promise<Span> {
    const inside = await processContainedSpansAsync(span, fn);
    return fn(inside);
}

async function processContainedSpansAsync(span: Span, fn: (s: Span) => Promise<Span>): Promise<Span> {
    switch (span.node) {
        case 'big': case 'bold': case 'italic': case 'quote':
        case 'ref': case 'ruby': case 'small': case 'span':
        case 'sub': case 'sup':
            return {
                ...span,
                span: await processSpanAsync(span.span, fn),
            };
        case 'image-span':
            return span;
        case undefined:
            if (isSimpleSpan(span)) {
                return span;
            } else if (isCompoundSpan(span)) {
                return Promise.all(span.map(s => processSpanAsync(s, fn)));
            }
        default:
            assertNever(span);
            return span;
    }
}

export function extractSpanText(span: Span): string {
    switch (span.node) {
        case 'big': case 'bold': case 'italic': case 'quote':
        case 'ref': case 'ruby': case 'small': case 'span':
        case 'sub': case 'sup':
            return extractSpanText(span.span);
        case 'image-span':
            return '';
        case undefined:
            if (isSimpleSpan(span)) {
                return span;
            } else if (isCompoundSpan(span)) {
                return span.map(extractSpanText).join('');
            }
        default:
            assertNever(span);
            return '';
    }
}

export function normalizeSpan(span: Span): Span {
    switch (span.node) {
        case 'big': case 'bold': case 'italic': case 'quote':
        case 'ref': case 'ruby': case 'small':
        case 'sub': case 'sup':
            return {
                ...span,
                span: normalizeSpan(span.span),
            };
        case 'span':
            // If no props set
            return Object.keys(span).length === 2
                ? normalizeSpan(span.span)
                : {
                    ...span,
                    span: normalizeSpan(span.span),
                };
        case 'image-span':
            return span;
        case undefined:
            if (isSimpleSpan(span)) {
                return span;
            } else if (isCompoundSpan(span)) {
                return normalizeCompoundSpan(span);
            }
        default:
            assertNever(span);
            return span;
    }
}

function normalizeCompoundSpan(spans: Span[]): Span {
    const result: Span[] = [];

    let current: SimpleSpan | undefined = undefined;
    for (let idx = 0; idx < spans.length; idx++) {
        const span = normalizeSpan(spans[idx]);
        if (isSimpleSpan(span)) {
            if (current === undefined) {
                current = span;
            } else {
                current += span;
            }
        } else {
            if (current !== undefined) {
                result.push(current);
                current = undefined;
            }
            result.push(span);
        }
    }
    if (current !== undefined) {
        result.push(current);
    }

    return result.length === 0 ? ''
        : result.length === 1 ? result[0]
            : result;
}

export function spanLength(span: Span): number {
    switch (span.node) {
        case 'big': case 'bold': case 'italic': case 'quote':
        case 'ref': case 'ruby': case 'small': case 'span':
        case 'sub': case 'sup':
            return spanLength(span.span);
        case 'image-span':
            return 0;
        case undefined:
            if (isSimpleSpan(span)) {
                return span.length;
            } else if (isCompoundSpan(span)) {
                return span.reduce((res, s) => res + spanLength(s), 0);
            }
        default:
            assertNever(span);
            return 0;
    }
}

export function* iterateSpans(spans: Span[]): Generator<[Span, number]> {
    let offset = 0;
    for (const span of spans) {
        yield [span, 0];
        if (isCompoundSpan(span)) {
            const subs = span;
            for (const [sub, sym] of iterateSpans(subs)) {
                yield [sub, sym + offset];
            }
        }
        offset += spanLength(span);
    }
}

export function isEmptyContentSpan(span: Span): boolean {
    switch (span.node) {
        case 'big': case 'bold': case 'italic': case 'quote':
        case 'ref': case 'ruby': case 'small': case 'span':
        case 'sub': case 'sup':
            return isEmptyContentSpan(span.span);
        case 'image-span':
            return false;
        case undefined:
            if (isSimpleSpan(span)) {
                return span.length === 0;
            } else if (isCompoundSpan(span)) {
                return span.every(isEmptyContentSpan);
            }
        default:
            assertNever(span);
            return true;
    }
}
