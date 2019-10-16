import { EditableNode } from '../model';

export function* iterateReferencedBookIds(nodes: EditableNode[]): Generator<string> {
    for (const node of nodes) {
        if (node.node === 'lib-quote') {
            yield node.quote.bookId;
        }
    }
}
