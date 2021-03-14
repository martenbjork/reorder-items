export type ID = string;

export type OrderedItem = {
  id: ID;
  order: number;
  column?: number;
  [x: string]: any;
};

export type IdItem = {
  id: ID;
  [x: string]: any;
};

export type InsertAction = {
  type: "INSERT";
  item: IdItem;
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

export type InsertInstruction = {
  type: "INSERT";
  item: OrderedItem;
};

export type UpdateInstruction = {
  type: "UPDATE";
  id: ID;
  order: number;
  column?: number;
};

export type RemoveInstruction = {
  type: "REMOVE";
  id: ID;
};

export type Instruction =
  | InsertInstruction
  | UpdateInstruction
  | RemoveInstruction;

export type Instructions = Instruction[];
