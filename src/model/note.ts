import { EditableNode } from './editable';

export type NoteContent = EditableNode;
export type Note = {
    uuid: string,
    content: NoteContent[],
    title?: string,
    lastEdited: Date,
};

export type NotePost = Omit<Note, 'lastEdited'>;
export type NoteUpdate = { uuid: string } & Partial<NotePost>;
