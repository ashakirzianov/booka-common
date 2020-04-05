import { BookRange } from './bookPath';
import { EditableNode } from './editable';

export type HighlightGroup =
    | 'first' | 'second' | 'third' | 'forth' | 'fifth' | 'sixth'
    ;
export type Highlight = {
    uuid: string,
    group: HighlightGroup,
    bookId: string,
    range: BookRange,
    comment?: EditableNode[],
};
export type HighlightPost = Highlight;
export type HighlightUpdate = { uuid: string } & Partial<Highlight>;
