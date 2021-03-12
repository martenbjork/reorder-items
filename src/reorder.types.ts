type ID = string;

export type SortableItem = {
  id: ID;
  order: number;
  column?: number;
  [x: string]: any;
};

export type InsertAction = {
  type: "INSERT";
  item: SortableItem;
  order: number;
  column?: number;
};

export type RemoveAction = {
  type: "REMOVE";
  id: ID;
};

export type MoveAction = {
  type: "MOVE";
  id: ID;
  toOrder: number;
  toColumn?: number;
};

export type Action = InsertAction | RemoveAction | MoveAction;

export type AddInstruction = {
  type: "ADD_ITEM";
  id: ID;
  order: number;
  column?: number;
};

export type UpdateInstruction = {
  type: "UPDATE_ITEM";
  id: ID;
  order: number;
  column?: number;
};

export type RemoveInstruction = {
  type: "REMOVE_ITEM";
  id: ID;
};

export type Instruction =
  | AddInstruction
  | UpdateInstruction
  | RemoveInstruction;
export type Instructions = Instruction[];
