import { Node, SemanticKey, SemanticForKey } from '../model';

export function getSemantic<S extends SemanticKey>(node: Node, semanticKey: S): SemanticForKey<S> | undefined {
    return node.node === undefined || node.semantics === undefined
        ? undefined
        : node.semantics
            .find(s => s.semantic === semanticKey) as SemanticForKey<S>;
}
