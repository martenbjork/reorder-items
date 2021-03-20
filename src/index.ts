import { reorder } from "./reorder";

const oldItems = [{ id: 123, order: 1 }];

const { instructions, items } = reorder(oldItems, {
  type: "REMOVE",
  id: 123,
});
