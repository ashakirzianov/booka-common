import { EditableNode } from './editable';
import { HasId } from './base';

export type NoteContent = EditableNode;
export type NotePost = {
    content: NoteContent[],
    title?: string,
};

export type NoteUpdate = HasId & Partial<NotePost>;

export type Note = NotePost & HasId & {
    lastEdited: Date,
};
