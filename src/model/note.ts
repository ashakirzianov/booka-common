import { GeneratedContentNode } from './nodes';

export type NoteDate = {
    content: GeneratedContentNode[],
    title?: string,
};

export type Note = {
    data: NoteDate,
    lastEdited: Date,
};
