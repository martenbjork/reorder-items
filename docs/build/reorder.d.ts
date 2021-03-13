import { SortableItem, Action, Instructions } from "./reorder.types";
/**
 * Performs an action (insert, remove, move) on the items.
 */
export declare function reorder(items: SortableItem[], action: Action): {
    items: SortableItem[];
    instructions: Instructions;
};
