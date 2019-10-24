import { BookRangeLocator } from './locator';
import { HasId } from './base';
import { EditableNode } from './editable';

export type HighlightContent = EditableNode;
export type HighlightPost = {
    group: string,
    location: BookRangeLocator,
    comment?: HighlightContent[],
};
export type HighlightUpdate = HasId & Partial<HighlightPost>;
export type Highlight = HighlightPost & HasId;
