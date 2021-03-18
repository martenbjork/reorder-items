import {
  OrderedItem,
  InsertAction,
  RemoveAction,
  Action,
  Instruction,
  Instructions,
  ID,
} from "./reorder.types";

function clampOrder<T extends ID>(
  items: OrderedItem<T>[],
  order: number
): number {
  let newOrder = order;
  if (newOrder < 0) {
    newOrder = 0;
  } else if (newOrder > items.length + 1) {
    newOrder = items.length;
  }
  return newOrder;
}

function insertItem<T extends ID>(
  items: OrderedItem<T>[],
  action: InsertAction<T>
): { items: OrderedItem<T>[]; instructions: Instructions<T> } {
  let instructions: Instruction<T>[] = [];

  let newOrder = clampOrder(items, action.order);

  let newItems = [...items].map(function bumpAndCreateUpdateInstruction(item) {
    const itemIsInColumn =
      typeof action.column === "number" ? item.column === action.column : true;

    if (itemIsInColumn && item.order >= action.order) {
      const bumpedItem = {
        ...item,
        order: item.order + 1,
      };

      let instruction: Instruction<T> = {
        type: "UPDATE",
        id: bumpedItem.id,
        order: bumpedItem.order,
      };

      instructions.push(instruction);

      return bumpedItem;
    }
    return item;
  });

  let newItem: OrderedItem<T> = {
    ...action.item,
    order: newOrder,
  };

  if (typeof action.column === "number") {
    newItem.column = action.column;
  }

  let instruction: Instruction<T> = {
    type: "INSERT",
    item: newItem,
  };

  instructions.push(instruction);

  newItems = [...newItems, newItem];

  return { items: newItems, instructions };
}

function removeItem<T extends ID>(
  items: OrderedItem<T>[],
  action: RemoveAction<T>
): { items: OrderedItem<T>[]; instructions: Instructions<T> } {
  let instructions: Instruction<T>[] = [];
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
export function reorder<T extends ID>(
  items: OrderedItem<T>[],
  action: Action<T>
): { items: OrderedItem<T>[]; instructions: Instructions<T> } {
  let allInstructions: Instructions<T> = [];
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
        let moveInstruction: Instruction<T> = {
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

  return { items: newItems, instructions: allInstructions };
}
