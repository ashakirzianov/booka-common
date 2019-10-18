import {
    Span, CompoundSpan, SimpleSpan, SingleSpan,
} from '../model';
import { assertNever, definedKeys } from './misc';

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

function containedSpans(span: Span): Span[] {
    switch (span.span) {
        case 'big': case 'bold': case 'italic': case 'quote':
        case 'ref': case 'ruby': case 'small': case 'span':
        case 'sub': case 'sup':
            return [span.content];
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
    switch (span.span) {
        case 'big': case 'bold': case 'italic': case 'quote':
        case 'ref': case 'ruby': case 'small': case 'span':
        case 'sub': case 'sup':
            return fn({
                ...span,
                content: processSpan(span.content, fn),
            });
        case 'image-span':
            return fn(span);
        case undefined:
            if (isSimpleSpan(span)) {
                return fn(span);
            } else if (isCompoundSpan(span)) {
                return fn(span.map(s => processSpan(s, fn)));
            }
        default:
            assertNever(span);
            return fn(span);
    }
}

export async function processSpanAsync(span: Span, fn: (s: Span) => Promise<Span>): Promise<Span> {
    switch (span.span) {
        case 'big': case 'bold': case 'italic': case 'quote':
        case 'ref': case 'ruby': case 'small': case 'span':
        case 'sub': case 'sup':
            return fn({
                ...span,
                content: await processSpanAsync(span.content, fn),
            });
        case 'image-span':
            return fn(span);
        case undefined:
            if (isSimpleSpan(span)) {
                return fn(span);
            } else if (isCompoundSpan(span)) {
                return fn(await Promise.all(span.map(s => processSpanAsync(s, fn))));
            }
        default:
            assertNever(span);
            return fn(span);
    }
}

export function extractSpanText(span: Span): string {
    switch (span.span) {
        case 'big': case 'bold': case 'italic': case 'quote':
        case 'ref': case 'ruby': case 'small': case 'span':
        case 'sub': case 'sup':
            return extractSpanText(span.content);
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
    switch (span.span) {
        case 'big': case 'bold': case 'italic': case 'quote':
        case 'ref': case 'ruby': case 'small':
        case 'sub': case 'sup':
            return {
                ...span,
                content: normalizeSpan(span.content),
            };
        case 'span':
            // If no props set
            return definedKeys(span).length === 2
                ? normalizeSpan(span.content)
                : {
                    ...span,
                    content: normalizeSpan(span.content),
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
    switch (span.span) {
        case 'big': case 'bold': case 'italic': case 'quote':
        case 'ref': case 'ruby': case 'small': case 'span':
        case 'sub': case 'sup':
            return spanLength(span.content);
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
        const subs = containedSpans(span);
        for (const [sub, sym] of iterateSpans(subs)) {
            yield [sub, sym + offset];
        }
        offset += spanLength(span);
    }
}

export function isEmptyContentSpan(span: Span): boolean {
    switch (span.span) {
        case 'big': case 'bold': case 'italic': case 'quote':
        case 'ref': case 'ruby': case 'small': case 'span':
        case 'sub': case 'sup':
            return isEmptyContentSpan(span.content);
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
