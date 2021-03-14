import {
  SortableItem,
  InsertAction,
  RemoveAction,
  Action,
  Instruction,
  Instructions,
} from "./reorder.types";

<<<<<<< HEAD
function clampOrder(items: SortableItem[], order: number): number {
=======
const clampOrder = (items: SortableItem[], order: number): number => {
>>>>>>> main
  let newOrder = order;
  if (newOrder < 0) {
    newOrder = 0;
  } else if (newOrder > items.length + 1) {
    newOrder = items.length;
  }
  return newOrder;
<<<<<<< HEAD
}

function insertItem(
=======
};

const insertItem = (
>>>>>>> main
  items: SortableItem[],
  action: InsertAction
): { items: SortableItem[]; instructions: Instructions } {
  let instructions: Instruction[] = [];

  let newOrder = clampOrder(items, action.order);

<<<<<<< HEAD
  let newItems = [...items].map(function bumpAndCreateUpdateInstruction(item) {
=======
  let newItems = [...items].map((item) => {
>>>>>>> main
    const itemIsInColumn =
      typeof action.column === "number" ? item.column === action.column : true;

    if (itemIsInColumn && item.order >= action.order) {
      const bumpedItem = {
        ...item,
        order: item.order + 1,
      };

      let instruction: Instruction = {
        type: "UPDATE",
        id: bumpedItem.id,
        order: bumpedItem.order,
      };

      instructions.push(instruction);

      return bumpedItem;
    }
    return item;
  });

  let newItem: SortableItem = {
    ...action.item,
    order: newOrder,
  };

  if (typeof action.column === "number") {
    newItem.column = action.column;
  }

  let instruction: Instruction = {
    type: "INSERT",
    item: newItem,
  };

  instructions.push(instruction);

  newItems = [...newItems, newItem];

  return { items: newItems, instructions };
}

function removeItem(
  items: SortableItem[],
  action: RemoveAction
): { items: SortableItem[]; instructions: Instructions } {
  let instructions: Instruction[] = [];
  let newItems = [...items];

  const removedItem = items.find((item) => item.id === action.id);

  if (removedItem) {
    instructions.push({
      type: "REMOVE",
      id: removedItem.id,
    });

    newItems = newItems
      .filter((item) => item.id !== action.id)
      .map(function reduceAndCreateUpdateInstruction(item) {
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
            type: "UPDATE",
            id: item.id,
            order: reducedItem.order,
          });

          return reducedItem;
        }
        return item;
      });
  }

  return { items: newItems, instructions };
}

/**
 * Performs an action (insert, remove, move) on the items.
 */
export function reorder(
  items: SortableItem[],
  action: Action
): { items: SortableItem[]; instructions: Instructions } {
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
    const movedItem = items.find(function findMovedItem(item) {
      return item.id === action.id;
    });

    if (movedItem) {
      let {
        items: removeResult,
        instructions: removeInstructions,
      } = removeItem(items, {
        type: "REMOVE",
        id: action.id,
      });
      allInstructions = [...allInstructions, ...removeInstructions];

      let {
        items: insertResult,
        instructions: insertInstructions,
      } = insertItem(removeResult, {
        type: "INSERT",
        order: action.toOrder,
        column: action.toColumn,
        item: movedItem,
      });

      newItems = insertResult;
      allInstructions = [...allInstructions, ...insertInstructions];

      // The INSERT and REMOVE operations above result in
      // 2 separate instructions. We actually only want
      // 1 instruction — an UPDATE one. So, we remove those
      // instructions and insert a new one.
      allInstructions = allInstructions.filter(
        (instruction) => instruction.type === "UPDATE"
      );
      const insertInstruction = insertInstructions.find(
        (instruction) => instruction.type === "INSERT"
      );
      if (insertInstruction.type === "INSERT") {
        let moveInstruction: Instruction = {
          type: "UPDATE",
          id: movedItem.id,
          order: insertInstruction.item.order,
        };
        if (typeof insertInstruction.item.column === "number") {
          moveInstruction.column = insertInstruction.item.column;
        }
        allInstructions.push(moveInstruction);
      }
    }
  }

<<<<<<< HEAD
  // newItems = sortItems(newItems);
  // allInstructions = sortInstructions(newItems, allInstructions);
=======
  newItems = sortItems(newItems);
  allInstructions = sortInstructions(newItems, allInstructions);
>>>>>>> main

  return { items: newItems, instructions: allInstructions };
}

function sortItems(items: SortableItem[]): SortableItem[] {
  return [...items].sort((a, b) => {
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
<<<<<<< HEAD
}

function sortInstructions(
  sortedItems: SortableItem[],
  instructions: Instructions
): Instructions {
  return [...instructions].sort((a, b) => {
=======

const sortInstructions = (
  sortedItems: SortableItem[],
  instructions: Instructions
): Instructions =>
  [...instructions].sort((a, b) => {
>>>>>>> main
    let aSortVal = 0;
    if (a.type === "INSERT") {
      aSortVal = sortedItems.findIndex((item) => item.id === a.item.id);
    } else if (a.type === "UPDATE") {
      aSortVal = sortedItems.findIndex((item) => item.id === a.id);
    } else {
      return -1;
    }

    let bSortVal = 0;
    if (b.type === "INSERT") {
      bSortVal = sortedItems.findIndex((item) => item.id === b.item.id);
    } else if (a.type === "UPDATE") {
      bSortVal = sortedItems.findIndex((item) => item.id === b.id);
    } else {
      return -1;
    }
    return aSortVal - bSortVal;
  });
<<<<<<< HEAD
}
=======
>>>>>>> main
