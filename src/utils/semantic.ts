import { Node, SemanticKey, HasSemantic } from '../model';

export function hasSemantic<S extends SemanticKey, N extends Node>(node: N, semanticKey: S): node is N & HasSemantic<S> {
    const semantic = (node as any).semantic;
    return semantic !== undefined && semantic[semanticKey] !== undefined;
}
