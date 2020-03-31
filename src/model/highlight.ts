import { DefEntity, EntityId } from './base';
import { BookRange } from './bookPath';
import { EditableNode } from './editable';

export type HighlightGroup = string;
export type Highlight = DefEntity<'highlight'> & {
    group: HighlightGroup,
    bookId: string,
    range: BookRange,
    comment?: EditableNode[],
};
export type HighlightPost = Highlight;
export type HighlightUpdate = EntityId & Partial<Highlight>;
