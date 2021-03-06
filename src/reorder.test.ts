import { reorder } from "./reorder";
import { IdItem, Instructions, OrderedItem } from "./reorder.types";
const orderBy = require("lodash.orderby");

const orderById = <T>(items: T[]): T[] => orderBy(items, ["id"]);

const itemA: OrderedItem = {
  id: "A",
  order: 0,
  extraField: "lorem",
};

const itemB: OrderedItem = {
  id: "B",
  order: 1,
  extraField: "ipsum",
};

const itemC: OrderedItem = {
  id: "C",
  order: 2,
  extraField: "dolor",
};

const newItem: IdItem = {
  id: "Q",
  extraField: "Hello",
};

let items: OrderedItem[] = [itemA, itemB, itemC];

describe("INSERT", () => {
  test("inserts at order -999 (adjusts order to 0)", () => {
    const { items: newItems, instructions } = reorder(items, {
      type: "INSERT",
      item: newItem,
      order: -999,
    });
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

    expect(orderById(instructions)).toStrictEqual(
      orderById(expectedInstructions)
    );
  });

  test("inserts at order 0", () => {
    const { items: newItems, instructions } = reorder(items, {
      type: "INSERT",
      item: newItem,
      order: 0,
    });

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

    expect(orderById(instructions)).toStrictEqual(
      orderById(expectedInstructions)
    );
  });

  test("inserts at order 1", () => {
    const { items: newItems, instructions } = reorder(items, {
      type: "INSERT",
      item: newItem,
      order: 1,
    });

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

    expect(orderById(instructions)).toStrictEqual(
      orderById(expectedInstructions)
    );
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

  test("inserts at order 999 (adjusts order to 3 ??? the maximum order in items + 1)", () => {
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

  it("returns values with string IDs when given an array with string IDs", () => {
    const { items: newItems, instructions } = reorder(items, {
      type: "INSERT",
      item: newItem,
      order: 1,
    });

    // Test returned items
    expect(newItems.map((item) => typeof item.id)).toEqual([
      "string",
      "string",
      "string",
      "string",
    ]);

    // Test returned instructions
    expect(
      instructions.map((instruction) => {
        if (instruction.type === "INSERT") {
          return typeof instruction.item.id;
        } else if (instruction.type === "UPDATE") {
          return typeof instruction.id;
        }
      })
    ).toEqual(["string", "string", "string"]);
  });

  it("returns values with numeric IDs when given an array with numeric IDs", () => {
    const { items: newItems, instructions } = reorder(
      [
        { ...items[0], id: 123 },
        { ...items[1], id: 456 },
        { ...items[2], id: 678 },
      ],
      {
        type: "INSERT",
        item: { ...newItem, id: 999 },
        order: 1,
      }
    );

    // Test returned items
    expect(newItems.map((item) => typeof item.id)).toEqual([
      "number",
      "number",
      "number",
      "number",
    ]);

    // Test returned instructions
    expect(
      instructions.map((instruction) => {
        if (instruction.type === "INSERT") {
          return typeof instruction.item.id;
        } else if (instruction.type === "UPDATE") {
          return typeof instruction.id;
        }
      })
    ).toEqual(["number", "number", "number"]);
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

  it("returns values with string IDs when given an array with string IDs", () => {
    const { items: newItems, instructions } = reorder(items, {
      type: "REMOVE",
      id: items[0].id,
    });

    // Test returned items
    expect(newItems.map((item) => typeof item.id)).toEqual([
      "string",
      "string",
    ]);

    // Test returned instructions
    expect(
      instructions.map(
        (instruction) =>
          (instruction.type === "REMOVE" || instruction.type === "UPDATE") &&
          typeof instruction.id
      )
    ).toEqual(["string", "string", "string"]);
  });

  it("returns values with numeric IDs when given an array with numeric IDs", () => {
    const itemsWithNumericIds = items.map((item, i) => ({
      ...item,
      id: i,
    }));

    const { items: newItems, instructions } = reorder(itemsWithNumericIds, {
      type: "REMOVE",
      id: itemsWithNumericIds[0].id,
    });

    // Test returned items
    expect(newItems.map((item) => typeof item.id)).toEqual([
      "number",
      "number",
    ]);

    // Test returned instructions
    expect(
      instructions.map(
        (instruction) =>
          (instruction.type === "REMOVE" || instruction.type === "UPDATE") &&
          typeof instruction.id
      )
    ).toEqual(["number", "number", "number"]);
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

  test("Does nothing if an item's order is the same as it's target order", () => {
    const { items: newItems, instructions } = reorder(items, {
      type: "MOVE",
      id: itemA.id,
      toOrder: itemA.order,
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
      { ...itemA, order: 2 },
      { ...itemB, order: 0 },
      { ...itemC, order: 1 },
    ]);

    const expectedInstructions: Instructions = [
      {
        type: "UPDATE",
        id: itemA.id,
        order: 2,
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

  test("Moves items from bottom to top", () => {
    const { items: newItems, instructions } = reorder(items, {
      type: "MOVE",
      id: itemC.id,
      toOrder: 0,
    });

    expect(orderById(newItems)).toStrictEqual(
      orderById([
        { ...itemA, order: 1 },
        { ...itemB, order: 2 },
        { ...itemC, order: 0 },
      ])
    );

    const expectedInstructions: Instructions = [
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
        order: 0,
      },
    ];

    expect(orderById(instructions)).toStrictEqual(
      orderById(expectedInstructions)
    );
  });

  it("Moves items from top to order 999 (and clamps order value)", () => {
    const { items: newItems, instructions } = reorder(items, {
      type: "MOVE",
      id: itemA.id,
      toOrder: 999,
    });

    expect(newItems).toStrictEqual([
      { ...itemA, order: 2 },
      { ...itemB, order: 0 },
      { ...itemC, order: 1 },
    ]);

    const expectedInstructions: Instructions = [
      {
        type: "UPDATE",
        id: itemA.id,
        order: 2,
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

  it("Moves items from bottom to order -1 (and adjusts order to 0)", () => {
    const { items: newItems, instructions } = reorder(items, {
      type: "MOVE",
      id: itemC.id,
      toOrder: -1,
    });

    expect(orderById(newItems)).toStrictEqual(
      orderById([
        { ...itemA, order: 1 },
        { ...itemB, order: 2 },
        { ...itemC, order: 0 },
      ])
    );

    const expectedInstructions: Instructions = [
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
        order: 0,
      },
    ];

    expect(orderById(instructions)).toStrictEqual(
      orderById(expectedInstructions)
    );
  });

  it("Moves items from top to middle of array", () => {
    const { items: newItems, instructions } = reorder(items, {
      type: "MOVE",
      id: itemA.id,
      toOrder: 1,
    });

    expect(orderById(newItems)).toStrictEqual(
      orderById([
        { ...itemA, order: 1 },
        { ...itemB, order: 0 },
        { ...itemC, order: 2 },
      ])
    );

    const expectedInstructions: Instructions = [
      {
        type: "UPDATE",
        id: itemA.id,
        order: 1,
      },
      {
        type: "UPDATE",
        id: itemB.id,
        order: 0,
      },
    ];

    expect(orderById(instructions)).toStrictEqual(
      orderById(expectedInstructions)
    );
  });

  it("Moves items from bottom to middle of array", () => {
    const { items: newItems, instructions } = reorder(items, {
      type: "MOVE",
      id: itemC.id,
      toOrder: 1,
    });

    expect(orderById(newItems)).toStrictEqual(
      orderById([
        { ...itemA, order: 0 },
        { ...itemB, order: 2 },
        { ...itemC, order: 1 },
      ])
    );

    const expectedInstructions: Instructions = [
      {
        type: "UPDATE",
        id: itemB.id,
        order: 2,
      },
      {
        type: "UPDATE",
        id: itemC.id,
        order: 1,
      },
    ];

    expect(orderById(instructions)).toStrictEqual(
      orderById(expectedInstructions)
    );
  });

  it("returns values with string IDs when given an array with string IDs", () => {
    const { items: newItems, instructions } = reorder(items, {
      type: "MOVE",
      id: itemA.id,
      toOrder: 100,
    });

    // Test returned items
    expect(newItems.map((item) => typeof item.id)).toEqual([
      "string",
      "string",
      "string",
    ]);

    // Test returned instructions
    expect(
      instructions.map((item) => item.type === "UPDATE" && typeof item.id)
    ).toEqual(["string", "string", "string"]);
  });

  it("returns values with numeric IDs when given an array with numeric IDs", () => {
    const itemsWithNumericIds = items.map((item, i) => ({
      ...item,
      id: i,
    }));

    const { items: newItems, instructions } = reorder(itemsWithNumericIds, {
      type: "REMOVE",
      id: itemsWithNumericIds[0].id,
    });

    // Test returned items
    expect(newItems.map((item) => typeof item.id)).toEqual([
      "number",
      "number",
    ]);

    // Test returned instructions
    expect(
      instructions.map(
        (item) =>
          (item.type === "REMOVE" || item.type === "UPDATE") && typeof item.id
      )
    ).toEqual(["number", "number", "number"]);
  });
});
