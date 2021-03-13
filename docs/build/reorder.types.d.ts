export declare type ID = string;
export declare type SortableItem = {
    id: ID;
    order: number;
    column?: number;
    [x: string]: any;
};
export declare type IdItem = {
    id: ID;
    [x: string]: any;
};
export declare type InsertAction = {
    type: "INSERT";
    item: IdItem;
    order: number;
    column?: number;
};
export declare type RemoveAction = {
    type: "REMOVE";
    id: ID;
};
export declare type MoveAction = {
    type: "MOVE";
    id: ID;
    toOrder: number;
    toColumn?: number;
};
export declare type Action = InsertAction | RemoveAction | MoveAction;
export declare type InsertInstruction = {
    type: "INSERT";
    item: SortableItem;
};
export declare type UpdateInstruction = {
    type: "UPDATE";
    id: ID;
    order: number;
    column?: number;
};
export declare type RemoveInstruction = {
    type: "REMOVE";
    id: ID;
};
export declare type Instruction = InsertInstruction | UpdateInstruction | RemoveInstruction;
export declare type Instructions = Instruction[];
