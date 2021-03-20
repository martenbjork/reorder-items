import {
  OrderedItem,
  InsertAction,
  RemoveAction,
  Action,
  Instructions,
  ID,
  MoveAction,
  UpdateInstruction,
  RemoveInstruction,
  InsertInstruction,
} from "./reorder.types";

function clampOrder<T extends ID>(itemCount: number, order: number): number {
  let newOrder = order;
  if (newOrder < 0) {
    newOrder = 0;
  } else if (newOrder > itemCount - 1) {
    newOrder = itemCount - 1;
  }
  return newOrder;
}

function insertItem<T extends ID>(
  items: OrderedItem<T>[],
  action: InsertAction<T>
): {
  items: OrderedItem<T>[];
  instructions: (InsertInstruction<T> | UpdateInstruction<T>)[];
} {
  let instructions: (InsertInstruction<T> | UpdateInstruction<T>)[] = [];

  const itemCountAfterInsert = items.length + 1;
  let newOrder = clampOrder(itemCountAfterInsert, action.order);

  let newItems = [...items].map(function bumpAndCreateUpdateInstruction(item) {
    if (item.order >= action.order) {
      const bumpedItem = {
        ...item,
        order: item.order + 1,
      };

      let instruction: UpdateInstruction<T> = {
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

  let instruction: InsertInstruction<T> = {
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
): {
  items: OrderedItem<T>[];
  instructions: (RemoveInstruction<T> | UpdateInstruction<T>)[];
} {
  let instructions: (RemoveInstruction<T> | UpdateInstruction<T>)[] = [];
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
        if (item.order > removedItem.order) {
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

function moveItem<T extends ID>(
  items: OrderedItem<T>[],
  action: MoveAction<T>
): { items: OrderedItem<T>[]; instructions: UpdateInstruction<T>[] } {
  let newItems = [...items];
  const instructions: UpdateInstruction<T>[] = [];

  const movedItem = items.find((item) => item.id === action.id);
  const movedItemIsActuallyMoving = movedItem?.order !== action.toOrder;

  if (movedItem && movedItemIsActuallyMoving) {
    const direction = action.toOrder > movedItem.order ? "DOWN" : "UP";
    if (direction === "DOWN") {
      newItems = newItems.map((item) => {
        if (item.order <= action.toOrder && item.order > movedItem.order) {
          const newOrder = item.order - 1;
          instructions.push({ type: "UPDATE", id: item.id, order: newOrder });
          return { ...item, order: newOrder };
        }

        if (item.id === action.id) {
          const newOrder = clampOrder(items.length, action.toOrder);
          instructions.push({ type: "UPDATE", id: item.id, order: newOrder });
          return { ...item, order: newOrder };
        }
        return item;
      });
    } else {
      newItems = newItems.map((item) => {
        if (item.order < movedItem.order && item.order >= action.toOrder) {
          const newOrder = item.order + 1;
          instructions.push({ type: "UPDATE", id: item.id, order: newOrder });
          return { ...item, order: newOrder };
        }

        if (item.id === action.id) {
          const newOrder = clampOrder(items.length, action.toOrder);
          instructions.push({ type: "UPDATE", id: item.id, order: newOrder });
          return { ...item, order: newOrder };
        }
        return item;
      });
    }
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
  switch (action.type) {
    case "INSERT":
      return insertItem(items, action);
    case "REMOVE":
      return removeItem(items, action);
    case "MOVE":
      return moveItem(items, action);
  }
}
