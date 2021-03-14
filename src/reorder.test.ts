import { reorder } from "./reorder";
import { IdItem, Instructions, SortableItem } from "./reorder.types";
const orderBy = require("lodash.orderby");

const orderById = <T>(items: T[]): T[] => orderBy(items, ["id"]);

const itemA: SortableItem = {
  id: "A",
  order: 0,
  extraField: "lorem",
};

const itemB: SortableItem = {
  id: "B",
  order: 1,
  extraField: "ipsum",
};

const itemC: SortableItem = {
  id: "C",
  order: 2,
  extraField: "dolor",
};

const itemAA: SortableItem = {
  id: "AA",
  column: 0,
  order: 0,
  extraField: "lorem",
};

const itemAB: SortableItem = {
  id: "AB",
  column: 0,
  order: 1,
  extraField: "ipsum",
};

const itemAC: SortableItem = {
  id: "AC",
  column: 0,
  order: 2,
  extraField: "dolor",
};

const itemBA: SortableItem = {
  id: "BA",
  column: 1,
  order: 0,
  extraField: "et",
};

const itemBB: SortableItem = {
  id: "BB",
  column: 1,
  order: 1,
  extraField: "amet",
};

const itemBC: SortableItem = {
  id: "BC",
  column: 1,
  order: 2,
  extraField: "consecteur",
};

const newItem: IdItem = {
  id: "Q",
  extraField: "Hello",
};

let items: SortableItem[] = [itemA, itemB, itemC];
let itemsInColumns: SortableItem[] = [
  itemAA,
  itemAB,
  itemAC,
  itemBA,
  itemBB,
  itemBC,
];

/**
 * To test:
 * - ✅ Insert
 * - ✅ Remove
 * - ✅ Move
 * - Nonsense operations (move item from 0 to 0)
 *
 * Types:
 * - ✅ No columns
 * - With columns
 *
 * Return data:
 * - New items
 * -- Check that ID is same type that was passed in
 * -- Check that all input properties returned
 * -- Check that no extra properties exist (like an undefined column property)
 * - Instructions
 *
 * Ranges:
 * - Negative range
 * - Zero
 * - Order within existing range
 * - Order at end of existing range
 * - Order outside existing range
 *
 * Validation for move and delete:
 * - Correct ids
 * - Incorrect ids
 *
 * Mutability
 * - Operations doesn't mutate state
 */

describe("Operations on items without 'column' property", () => {
  describe("INSERT", () => {
    test("inserts at order -999 (adjusts order to 0)", () => {
      const { items: newItems, instructions } = reorder(items, {
        type: "INSERT",
        item: newItem,
        order: -999,
      });
<<<<<<< HEAD
      expect(orderById(newItems)).toStrictEqual(
        orderById([
          { ...newItem, order: 0 },
          {
            ...itemA,
            order: 1,
          },
          { ...itemB, order: 2 },
          { ...itemC, order: 3 },
        ])
      );
=======
      expect(newItems).toStrictEqual([
        { ...newItem, order: 0 },
        {
          ...itemA,
          order: 1,
        },
        { ...itemB, order: 2 },
        { ...itemC, order: 3 },
      ]);
>>>>>>> main

      const expectedInstructions: Instructions = [
        {
          type: "INSERT",
          item: {
            ...newItem,
            order: 0,
          },
        },
        {
          type: "UPDATE",
          id: itemA.id,
          order: 1,
        },
        {
          type: "UPDATE",
          id: itemB.id,
          order: 2,
        },
        {
          type: "UPDATE",
          id: itemC.id,
          order: 3,
        },
      ];

<<<<<<< HEAD
      expect(orderById(instructions)).toStrictEqual(
        orderById(expectedInstructions)
      );
=======
      expect(instructions).toStrictEqual(expectedInstructions);
>>>>>>> main
    });

    test("inserts at order 0", () => {
      const { items: newItems, instructions } = reorder(items, {
        type: "INSERT",
        item: newItem,
        order: 0,
      });

<<<<<<< HEAD
      expect(orderById(newItems)).toStrictEqual(
        orderById([
          { ...newItem, order: 0 },
          {
            ...itemA,
            order: 1,
          },
          { ...itemB, order: 2 },
          { ...itemC, order: 3 },
        ])
      );
=======
      expect(newItems).toStrictEqual([
        { ...newItem, order: 0 },
        {
          ...itemA,
          order: 1,
        },
        { ...itemB, order: 2 },
        { ...itemC, order: 3 },
      ]);
>>>>>>> main

      const expectedInstructions: Instructions = [
        {
          type: "INSERT",
          item: {
            ...newItem,
            order: 0,
          },
        },
        {
          type: "UPDATE",
          id: itemA.id,
          order: 1,
        },
        {
          type: "UPDATE",
          id: itemB.id,
          order: 2,
        },
        {
          type: "UPDATE",
          id: itemC.id,
          order: 3,
        },
      ];

<<<<<<< HEAD
      expect(orderById(instructions)).toStrictEqual(
        orderById(expectedInstructions)
      );
=======
      expect(instructions).toStrictEqual(expectedInstructions);
>>>>>>> main
    });

    test("inserts at order 1", () => {
      const { items: newItems, instructions } = reorder(items, {
        type: "INSERT",
        item: newItem,
        order: 1,
      });

<<<<<<< HEAD
      expect(orderById(newItems)).toStrictEqual(
        orderById([
          {
            ...itemA,
            order: 0,
          },
          { ...newItem, order: 1 },
          { ...itemB, order: 2 },
          { ...itemC, order: 3 },
        ])
      );
=======
      expect(newItems).toStrictEqual([
        {
          ...itemA,
          order: 0,
        },
        { ...newItem, order: 1 },
        { ...itemB, order: 2 },
        { ...itemC, order: 3 },
      ]);
>>>>>>> main

      const expectedInstructions: Instructions = [
        {
          type: "INSERT",
          item: {
            ...newItem,
            order: 1,
          },
        },
        {
          type: "UPDATE",
          id: itemB.id,
          order: 2,
        },
        {
          type: "UPDATE",
          id: itemC.id,
          order: 3,
        },
      ];

<<<<<<< HEAD
      expect(orderById(instructions)).toStrictEqual(
        orderById(expectedInstructions)
      );
=======
      expect(instructions).toStrictEqual(expectedInstructions);
>>>>>>> main
    });

    test("inserts at order 3", () => {
      const { items: newItems, instructions } = reorder(items, {
        type: "INSERT",
        item: newItem,
        order: 3,
      });

      expect(newItems).toStrictEqual([
        itemA,
        itemB,
        itemC,
        { ...newItem, order: 3 },
      ]);

      const expectedInstructions: Instructions = [
        {
          type: "INSERT",
          item: {
            ...newItem,
            order: 3,
          },
        },
      ];

      expect(instructions).toStrictEqual(expectedInstructions);
    });

    test("inserts at order 999 (adjusts order to 3 – the maximum order in items + 1)", () => {
      const { items: newItems, instructions } = reorder(items, {
        type: "INSERT",
        item: newItem,
        order: 999,
      });

      expect(newItems).toStrictEqual([
        itemA,
        itemB,
        itemC,
        { ...newItem, order: 3 },
      ]);

      const expectedInstructions: Instructions = [
        {
          type: "INSERT",
          item: {
            ...newItem,
            order: 3,
          },
        },
      ];

      expect(instructions).toStrictEqual(expectedInstructions);
    });
  });

  describe("REMOVE", () => {
    test("Does nothing if id is invalid", () => {
      const { items: newItems, instructions } = reorder(items, {
        type: "REMOVE",
        id: "Q",
      });
      expect(newItems).toStrictEqual(items);
      expect(instructions).toStrictEqual([]);
    });

    test("Removes item at order 0", () => {
      const { items: newItems, instructions } = reorder(items, {
        type: "REMOVE",
        id: itemA.id,
      });
      expect(newItems).toStrictEqual([
        { ...itemB, order: 0 },
        { ...itemC, order: 1 },
      ]);

      const expectedInstructions: Instructions = [
        {
          type: "REMOVE",
          id: itemA.id,
        },
        {
          type: "UPDATE",
          id: itemB.id,
          order: 0,
        },
        {
          type: "UPDATE",
          id: itemC.id,
          order: 1,
        },
      ];

      expect(instructions).toStrictEqual(expectedInstructions);
    });

    it("Removes item at order 1", () => {
      const { items: newItems, instructions } = reorder(items, {
        type: "REMOVE",
        id: itemB.id,
      });

      expect(newItems).toStrictEqual([itemA, { ...itemC, order: 1 }]);

      const expectedInstructions: Instructions = [
        {
          type: "REMOVE",
          id: itemB.id,
        },
        {
          type: "UPDATE",
          id: itemC.id,
          order: 1,
        },
      ];
      expect(expectedInstructions).toStrictEqual(instructions);
    });

    it("Removes item at order 1", () => {
      const { items: newItems, instructions } = reorder(items, {
        type: "REMOVE",
        id: itemB.id,
      });

      expect(newItems).toStrictEqual([itemA, { ...itemC, order: 1 }]);

      const expectedInstructions: Instructions = [
        {
          type: "REMOVE",
          id: itemB.id,
        },
        {
          type: "UPDATE",
          id: itemC.id,
          order: 1,
        },
      ];
      expect(expectedInstructions).toStrictEqual(instructions);
    });

    it("Removes item at order 2 (last item)", () => {
      const { items: newItems, instructions } = reorder(items, {
        type: "REMOVE",
        id: itemC.id,
      });

      expect(newItems).toStrictEqual([itemA, itemB]);

      const expectedInstructions: Instructions = [
        {
          type: "REMOVE",
          id: itemC.id,
        },
      ];
      expect(expectedInstructions).toStrictEqual(instructions);
    });
  });

  describe("MOVE", () => {
    test("Does nothing if id doesn't exist", () => {
      const { items: newItems, instructions } = reorder(items, {
        type: "MOVE",
        id: "q",
        toOrder: 0,
      });

      expect(newItems).toStrictEqual(items);
      expect(instructions).toStrictEqual([]);
    });

    test("Moves items from top to bottom", () => {
      const { items: newItems, instructions } = reorder(items, {
        type: "MOVE",
        id: itemA.id,
        toOrder: 2,
      });

      expect(newItems).toStrictEqual([
        { ...itemB, order: 0 },
        { ...itemC, order: 1 },
        { ...itemA, order: 2 },
      ]);

      const expectedInstructions: Instructions = [
        {
          type: "UPDATE",
          id: itemB.id,
          order: 0,
        },
        { type: "UPDATE", id: itemC.id, order: 1 },
        {
          type: "UPDATE",
          id: itemA.id,
          order: 2,
        },
      ];

      expect(instructions).toStrictEqual(expectedInstructions);
    });

    test("Moves items from bottom to top", () => {
      const { items: newItems, instructions } = reorder(items, {
        type: "MOVE",
        id: itemC.id,
        toOrder: 0,
      });

<<<<<<< HEAD
      expect(orderById(newItems)).toStrictEqual(
        orderById([
          { ...itemC, order: 0 },
          { ...itemA, order: 1 },
          { ...itemB, order: 2 },
        ])
      );
=======
      expect(newItems).toStrictEqual([
        { ...itemC, order: 0 },
        { ...itemA, order: 1 },
        { ...itemB, order: 2 },
      ]);
>>>>>>> main

      const expectedInstructions: Instructions = [
        {
          type: "UPDATE",
          id: itemC.id,
          order: 0,
        },
        {
          type: "UPDATE",
          id: itemA.id,
          order: 1,
        },
        {
          type: "UPDATE",
          id: itemB.id,
          order: 2,
        },
      ];

<<<<<<< HEAD
      expect(orderById(instructions)).toStrictEqual(
        orderById(expectedInstructions)
      );
=======
      expect(instructions).toStrictEqual(expectedInstructions);
>>>>>>> main
    });

    it("Moves items from top to order 999 (and adjusts order max order + 1)", () => {
      const { items: newItems, instructions } = reorder(items, {
        type: "MOVE",
        id: itemA.id,
        toOrder: 999,
      });

      expect(newItems).toStrictEqual([
        { ...itemB, order: 0 },
        { ...itemC, order: 1 },
        { ...itemA, order: 2 },
      ]);

      const expectedInstructions: Instructions = [
        {
          type: "UPDATE",
          id: itemB.id,
          order: 0,
        },
        { type: "UPDATE", id: itemC.id, order: 1 },
        {
          type: "UPDATE",
          id: itemA.id,
          order: 2,
        },
      ];

      expect(instructions).toStrictEqual(expectedInstructions);
    });

    it("Moves items from bottom to order -1 (and adjusts order to 0)", () => {
      const { items: newItems, instructions } = reorder(items, {
        type: "MOVE",
        id: itemC.id,
        toOrder: -1,
      });

<<<<<<< HEAD
      expect(orderById(newItems)).toStrictEqual(
        orderById([
          { ...itemC, order: 0 },
          { ...itemA, order: 1 },
          { ...itemB, order: 2 },
        ])
      );
=======
      expect(newItems).toStrictEqual([
        { ...itemC, order: 0 },
        { ...itemA, order: 1 },
        { ...itemB, order: 2 },
      ]);
>>>>>>> main

      const expectedInstructions: Instructions = [
        {
          type: "UPDATE",
          id: itemC.id,
          order: 0,
        },
        {
          type: "UPDATE",
          id: itemA.id,
          order: 1,
        },
        {
          type: "UPDATE",
          id: itemB.id,
          order: 2,
        },
      ];

<<<<<<< HEAD
      expect(orderById(instructions)).toStrictEqual(
        orderById(expectedInstructions)
      );
=======
      expect(instructions).toStrictEqual(expectedInstructions);
>>>>>>> main
    });
  });
});

describe("Operations on items with 'column' property", () => {
  describe("INSERT", () => {
    test("Inserts item in column 1, order 0", () => {
      const { items: newItems, instructions } = reorder(itemsInColumns, {
        type: "INSERT",
        item: newItem,
        column: 1,
        order: 0,
      });

<<<<<<< HEAD
      expect(orderById(newItems)).toStrictEqual(
        orderById([
          itemAA,
          itemAB,
          itemAC,
          { ...newItem, column: 1, order: 0 },
          { ...itemBA, order: 1 },
          { ...itemBB, order: 2 },
          { ...itemBC, order: 3 },
        ])
      );
=======
      expect(newItems).toStrictEqual([
        itemAA,
        itemAB,
        itemAC,
        { ...newItem, column: 1, order: 0 },
        { ...itemBA, order: 1 },
        { ...itemBB, order: 2 },
        { ...itemBC, order: 3 },
      ]);
>>>>>>> main

      const expectedInstructions: Instructions = [
        {
          type: "INSERT",
          item: {
            ...newItem,
            column: 1,
            order: 0,
          },
        },
        {
          type: "UPDATE",
          id: itemBA.id,
          order: 1,
        },
        {
          type: "UPDATE",
          id: itemBB.id,
          order: 2,
        },
        {
          type: "UPDATE",
          id: itemBC.id,
          order: 3,
        },
      ];

<<<<<<< HEAD
      expect(orderById(instructions)).toStrictEqual(
        orderById(expectedInstructions)
      );
=======
      expect(instructions).toStrictEqual(expectedInstructions);
>>>>>>> main
    });
  });

  describe("MOVE", () => {
    test("Moves an item from column 0 to column 1", () => {
      const { items: newItems, instructions } = reorder(itemsInColumns, {
        type: "MOVE",
        id: itemAA.id,
        toColumn: 1,
        toOrder: 0,
      });

<<<<<<< HEAD
      expect(orderById(newItems)).toStrictEqual(
        orderById(
          orderById([
            { ...itemAB, order: 0 },
            { ...itemAC, order: 1 },
            { ...itemAA, column: 1, order: 0 },
            { ...itemBA, order: 1 },
            { ...itemBB, order: 2 },
            { ...itemBC, order: 3 },
          ])
        )
      );
=======
      expect(newItems).toStrictEqual([
        { ...itemAB, order: 0 },
        { ...itemAC, order: 1 },
        { ...itemAA, column: 1, order: 0 },
        { ...itemBA, order: 1 },
        { ...itemBB, order: 2 },
        { ...itemBC, order: 3 },
      ]);
>>>>>>> main

      const expectedInstructions: Instructions = [
        {
          type: "UPDATE",
          id: itemAB.id,
          order: 0,
        },
        {
          type: "UPDATE",
          id: itemAC.id,
          order: 1,
        },
        {
          type: "UPDATE",
          id: itemAA.id,
          column: 1,
          order: 0,
        },
        {
          type: "UPDATE",
          id: itemBA.id,
          order: 1,
        },
        {
          type: "UPDATE",
          id: itemBB.id,
          order: 2,
        },
        {
          type: "UPDATE",
          id: itemBC.id,
          order: 3,
        },
      ];

<<<<<<< HEAD
      expect(orderById(instructions)).toStrictEqual(
        orderById(expectedInstructions)
      );
=======
      expect(instructions).toStrictEqual(expectedInstructions);
>>>>>>> main
    });

    // test("Moves items from 1 to column -1 and (adjusts column to 0)", () => {
    //   expect(true).toStrictEqual(false);
    // });
    // test("Moves items from 0 to column 999 and (adjusts column to 1)", () => {
    //   expect(true).toStrictEqual(false);
    // });
  });
});
