import { Node, SemanticKey, SemanticForKey } from '../model';

export function hasSemantic<S extends SemanticKey, N extends Node>(node: N, semanticKey: S): node is N & SemanticForKey<S> {
    return (node as any).semantic === semanticKey;
}
