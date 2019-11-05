import { HasId } from './base';
import { EditableNode } from './editable';
import { BookRange } from './bookRange';

export type HighlightContent = EditableNode;
export type HighlightPost = {
    group: string,
    location: {
        bookId: string,
        range: BookRange,
    },
    comment?: HighlightContent[],
};
export type HighlightUpdate = HasId & Partial<HighlightPost>;
export type Highlight = HighlightPost & HasId;
