import { GeneratedContentNode } from './nodes';

export type NoteContentNode = GeneratedContentNode;
export type NoteData = {
    content: GeneratedContentNode[],
    title?: string,
};

export type Note = {
    data: NoteData,
    lastEdited: Date,
};
