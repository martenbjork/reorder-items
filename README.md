<h1 align="center">reorder-items</h1>

<p align="center">A helpful algorithm for persisting the order of items.</p>

<p align="center">0.7kb minified + gzipped &bull; No dependencies &bull; <a href="#usage">How to use it</a></p>

<div align="center">
    <a href="https://www.travis-ci.com/martenbjork/reorder-items">
        <img src="https://www.travis-ci.com/martenbjork/reorder-items.svg?branch=main" alt="Build status">
    </a>
</div>

## Use case

Your database stores ordered items:
```
ID                                    | Order
--------------------------------------|------------------------
af84c0bd-342d-4495-b16d-2aadf3cb74b3  | 0
e34094bf-e62a-4056-b145-d5698cf8bb9d  | 1
```

Your front end fetches these items through an API and stores them as an array:

```ts
[
  {
    id: "af84c0bd-342d-4495-b16d-2aadf3cb74b3",
    order: 0,
    ...
  },
  {
    id: "e34094bf-e62a-4056-b145-d5698cf8bb9d",
    order: 1,
    ...
  },
  ...
]
```

#### The tricky part

- When an item is added, removed or moved, you need to update the list to reflect the change. Specifically, the `order` value need to be updated correctly.

- Changes need to be made optimistically in the browser cache.

- They also need to be persisted on the back end.

<div align="center">
  <p>—</p>
  <p>This package gives you a deterministic way to handle it.</p> 
  <p>It's designed to make sense for humans.</p>
  <p>🌏</p>
</div>

## Usage

<pre align="center">
const { instructions, items }  =  reorder(currentItems, action);
</pre>

 <table>
 <tbody>
 <tr>
 <th colspan="2"><div align="center">What reorder() returns 👆</div></th>
 <th colspan="2"><div align="center">👆 Your inputs</div></th>
 </tr>
    <tr>
        <td width="25%" valign="top">
            <p><code>instructions</code> contain the changes that need to be made to the original array. If you need to make changes in a database, these instructions tell you exactly what changes to make.</p>


```ts
type Instruction = 
  | InsertInstruction 
  | RemoveInstruction
  | UpdateInstruction; 

type InsertInstruction = {
  type: "INSERT";
  item: OrderedItem;
};

type UpdateInstruction = {
  type: "UPDATE";
  id: ID;
  order: number;
  column?: number;
};

type RemoveInstruction = {
  type: "REMOVE";
  id: ID;
};
```

</td>
<td width="25%" valign="top">
<p><code>items</code> is a new array with all the changes already applied. Ready to go!</p>
</td>
<td width="25%" valign="top">
<p><code>currentItems</code> is an array of objects.</p>
</td>
<td width="25%" valign="top">
  <p><code>action</code> is a redux-like action with information about the change that you want to make.</p>

```ts
type Action = 
  | InsertAction 
  | RemoveAction 
  | MoveAction;

type InsertAction = {
  type: "INSERT";
  item: IdItem;
  order: number;
  column?: number;
};

type RemoveAction = {
  type: "REMOVE";
  id: ID;
};

type MoveAction = {
  type: "MOVE";
  id: ID;
  toOrder: number;
  toColumn?: number;
};
```

  </td>
</tr>

  </tbody>
</table>

## Example

![Schematic showing how data flows from the UI to the front end and then the back end](./schematic.png)

You have a list with 2 items. You want to add a new item to the beginning of the list.

```ts
const items = [
  {
    id: "item-0",
    order: 0,
    title: "Stockholm",
  },
  {
    id: "item-1",
    order: 1,
    title: "Ottawa",
  },
];

const { instructions, newItems } = reorder(items, {
  action: "INSERT",
  item: {
    id: "item-2",
    title: "Faro",
  },
  order: 0,
});
```

`instructions` tells you what changes to make to your database or cache or order to end up in the state above.

```ts
console.log(instructions);

[
  {
    type: "INSERT",
    item: {
      id: "item-2",
      title: "Faro",
    },
    order: 0,
  },
  {
    type: "UPDATE",
    id: "item-0",
    order: 1,
  },
  {
    type: "UPDATE",
    id: "item-1",
    order: 2,
  },
];
```

`newItems` contains a new array with all the changes applied.

```ts
console.log(newItems);

[
  {
    id: "item-2",
    order: 0,
    title: "Faro",
  },
  {
    id: "item-0",
    order: 1,
    title: "Stockholm",
  },
  {
    id: "item-1",
    order: 2,
    title: "Ottawa",
  },
];
```

## Details

### Performance

https://reorder-items.netlify.app

### Order

Items and instructions may be returned in any order. This allows the underlying algoritm to simply ignore the order of the results and instead optimize for speed.

### Sources

https://blog.logrocket.com/publishing-node-modules-typescript-es-modules/
