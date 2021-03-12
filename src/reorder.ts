import {
  SortableItem,
  InsertAction,
  RemoveAction,
  Action,
  Instruction,
  Instructions,
} from "./reorder.types";

const insertItem = (
  items: SortableItem[],
  action: InsertAction
): { items: SortableItem[]; instructions: Instructions } => {
  let instructions: Instruction[] = [];

  let newItems = [...items].map((item) => {
    const itemIsInColumn =
      typeof action.column === "number" ? item.column === action.column : true;

    if (itemIsInColumn && item.order >= action.order) {
      const bumpedItem = {
        ...item,
        order: item.order + 1,
      };

      let instruction: Instruction = {
        type: "UPDATE_ITEM",
        id: bumpedItem.id,
        order: bumpedItem.order,
      };
      if (typeof action.column === "number") {
        instruction.column === action.column;
      }
      instructions.push(instruction);

      return bumpedItem;
    }
    return item;
  });

  const newItem = {
    ...action.item,
    order: action.order,
    column: action.column ? action.column : action.item.column,
  };
  let instruction: Instruction = {
    type: "ADD_ITEM",
    id: newItem.id,
    order: action.order,
  };
  if (typeof action.column === "number") {
    instruction.column = action.column;
  }
  instructions.push(instruction);

  newItems = [...newItems, newItem];

  return { items: newItems, instructions };
};

const removeItem = (
  items: SortableItem[],
  action: RemoveAction
): { items: SortableItem[]; instructions: Instructions } => {
  let instructions: Instruction[] = [];
  let newItems = [...items];

  const removedItem = items.find((item) => item.id === action.id);

  if (removedItem) {
    instructions.push({
      type: "REMOVE_ITEM",
      id: removedItem.id,
    });

    newItems = newItems
      .filter((item) => item.id !== action.id)
      .map((item) => {
        const itemIsInColumn =
          typeof removedItem.column === "number"
            ? item.column === removedItem.column
            : true;

        if (itemIsInColumn && item.order > removedItem.order) {
          let reducedItem = {
            ...item,
            order: item.order - 1,
          };

          instructions.push({
            type: "UPDATE_ITEM",
            id: item.id,
            order: item.order,
          });

          return reducedItem;
        }
        return item;
      });
  }

  return { items: newItems, instructions };
};

/**
 * Takes an action (insert, remove, move) on the items.
 */
export const reorder = (
  items: SortableItem[],
  action: Action
): { items: SortableItem[]; instructions: Instructions } => {
  let allInstructions: Instructions = [];
  let newItems = [...items];

  // If INSERT, bump the indices in same columns (if after inserted order)
  if (action.type === "INSERT") {
    let { items: insertResult, instructions } = insertItem(items, action);
    newItems = insertResult;
    allInstructions = [...allInstructions, ...instructions];
  }
  // If REMOVE, reduce the indices in same column (if after removed order)
  else if (action.type === "REMOVE") {
    let { items: removeResult, instructions } = removeItem(items, action);
    newItems = removeResult;
    allInstructions = [...allInstructions, ...instructions];
  }

  // If MOVE, first do a REMOVE, then an INSERT
  else if (action.type === "MOVE") {
    const movedItem = items.find((item) => item.id === action.id);

    if (movedItem) {
      let {
        items: removeResult,
        instructions: removeInstructions,
      } = removeItem(items, {
        type: "REMOVE",
        id: action.id,
      });
      newItems = removeResult;
      allInstructions = [...allInstructions, ...removeInstructions];

      let {
        items: insertResult,
        instructions: insertInstructions,
      } = insertItem(newItems, {
        type: "INSERT",
        order: action.toOrder,
        column: action.toColumn,
        item: movedItem,
      });

      newItems = insertResult;
      allInstructions = [...allInstructions, ...insertInstructions];
    }
  }

  newItems = sortItems(newItems);

  return { items: newItems, instructions: allInstructions };
};

const sortItems = (items: SortableItem[]): SortableItem[] =>
  [...items].sort((a, b) => {
    if (
      typeof a.column === "number" &&
      typeof b.column === "number" &&
      a.column > b.column
    ) {
      return 1;
    } else if (
      typeof a.column === "number" &&
      typeof b.column === "number" &&
      a.column < b.column
    ) {
      return -1;
    } else {
      return a.order - b.order;
    }
  });
