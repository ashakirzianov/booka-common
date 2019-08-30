import { GeneratedContentNode } from './nodes';

export type NoteContentNode = GeneratedContentNode;
export type NoteData = {
    content: GeneratedContentNode[],
    title?: string,
};

export type Note = {
    _id: string,
    data: NoteData,
    lastEdited: Date,
};
