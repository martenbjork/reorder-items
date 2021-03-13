function clampOrder(items, order) {
    let newOrder = order;
    if (newOrder < 0) {
        newOrder = 0;
    }
    else if (newOrder > items.length + 1) {
        newOrder = items.length;
    }
    return newOrder;
}
function insertItem(items, action) {
    let instructions = [];
    let newOrder = clampOrder(items, action.order);
    let newItems = [...items].map(function bumpAndCreateUpdateInstruction(item) {
        const itemIsInColumn = typeof action.column === "number" ? item.column === action.column : true;
        if (itemIsInColumn && item.order >= action.order) {
            const bumpedItem = {
                ...item,
                order: item.order + 1,
            };
            let instruction = {
                type: "UPDATE",
                id: bumpedItem.id,
                order: bumpedItem.order,
            };
            instructions.push(instruction);
            return bumpedItem;
        }
        return item;
    });
    let newItem = {
        ...action.item,
        order: newOrder,
    };
    if (typeof action.column === "number") {
        newItem.column = action.column;
    }
    let instruction = {
        type: "INSERT",
        item: newItem,
    };
    instructions.push(instruction);
    newItems = [...newItems, newItem];
    return { items: newItems, instructions };
}
function removeItem(items, action) {
    let instructions = [];
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
            const itemIsInColumn = typeof removedItem.column === "number"
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
export function reorder(items, action) {
    let allInstructions = [];
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
            let { items: removeResult, instructions: removeInstructions, } = removeItem(items, {
                type: "REMOVE",
                id: action.id,
            });
            allInstructions = [...allInstructions, ...removeInstructions];
            let { items: insertResult, instructions: insertInstructions, } = insertItem(removeResult, {
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
            allInstructions = allInstructions.filter((instruction) => instruction.type === "UPDATE");
            const insertInstruction = insertInstructions.find((instruction) => instruction.type === "INSERT");
            if (insertInstruction.type === "INSERT") {
                let moveInstruction = {
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
    // newItems = sortItems(newItems);
    // allInstructions = sortInstructions(newItems, allInstructions);
    return { items: newItems, instructions: allInstructions };
}
function sortItems(items) {
    return [...items].sort((a, b) => {
        if (typeof a.column === "number" &&
            typeof b.column === "number" &&
            a.column > b.column) {
            return 1;
        }
        else if (typeof a.column === "number" &&
            typeof b.column === "number" &&
            a.column < b.column) {
            return -1;
        }
        else {
            return a.order - b.order;
        }
    });
}
function sortInstructions(sortedItems, instructions) {
    return [...instructions].sort((a, b) => {
        let aSortVal = 0;
        if (a.type === "INSERT") {
            aSortVal = sortedItems.findIndex((item) => item.id === a.item.id);
        }
        else if (a.type === "UPDATE") {
            aSortVal = sortedItems.findIndex((item) => item.id === a.id);
        }
        else {
            return -1;
        }
        let bSortVal = 0;
        if (b.type === "INSERT") {
            bSortVal = sortedItems.findIndex((item) => item.id === b.item.id);
        }
        else if (a.type === "UPDATE") {
            bSortVal = sortedItems.findIndex((item) => item.id === b.id);
        }
        else {
            return -1;
        }
        return aSortVal - bSortVal;
    });
}
//# sourceMappingURL=reorder.js.map