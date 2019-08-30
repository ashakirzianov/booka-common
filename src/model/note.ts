import { GeneratedContentNode } from './nodes';

export type NoteContentNode = GeneratedContentNode;
export type NoteData = {
    content: GeneratedContentNode[],
    title?: string,
};

export type Note = NoteData & {
    _id: string,
    lastEdited: Date,
};
