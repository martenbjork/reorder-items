export type ID = string | number;

export type OrderedItem<T extends ID = string> = {
  id: T;
  order: number;
  column?: number;
  [x: string]: any;
};

export type IdItem<T extends ID = string> = {
  id: T;
  [x: string]: any;
};

export type InsertAction<T extends ID> = {
  type: "INSERT";
  item: IdItem<T>;
  order: number;
  column?: number;
};

export type RemoveAction<T extends ID> = {
  type: "REMOVE";
  id: T;
};

export type MoveAction<T extends ID> = {
  type: "MOVE";
  id: T;
  toOrder: number;
  toColumn?: number;
};

export type Action<T extends ID> =
  | InsertAction<T>
  | RemoveAction<T>
  | MoveAction<T>;

export type InsertInstruction<T extends ID> = {
  type: "INSERT";
  item: OrderedItem<T>;
};

export type UpdateInstruction<T extends ID> = {
  type: "UPDATE";
  id: T;
  order: number;
  column?: number;
};

export type RemoveInstruction<T extends ID> = {
  type: "REMOVE";
  id: T;
};

export type Instruction<T extends ID = string> =
  | InsertInstruction<T>
  | UpdateInstruction<T>
  | RemoveInstruction<T>;

export type Instructions<T extends ID = string> = Instruction<T>[];
