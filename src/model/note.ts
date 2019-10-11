import { EditableNode } from './editable';

export type NoteContentNode = EditableNode;
export type NoteData = {
    content: NoteContentNode[],
    title?: string,
};

export type Note = NoteData & {
    _id: string,
    lastEdited: Date,
};
