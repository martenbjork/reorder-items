<h1 align="center">reorder-items</h1>

<p align="center">A helpful algorithm for sorting arrays of objects.</p>

<p align="center">0.7kb minified + gzipped &bull; No dependencies &bull; <a href="#usage">How to use it</a></p>

<div align="center">
    <a href="https://www.travis-ci.com/martenbjork/reorder-items">
        <img src="https://www.travis-ci.com/martenbjork/reorder-items.svg?branch=main" alt="Build status">
    </a>
</div>

## Use case

You have an array of objects. Each object contains an `id` and an `order` values.

```ts
[
    {
        id: "item-0",
        order: 0,
        title: "Stockholm"
    },
    {
        id: "item-1",
        order: 1,
        title: "Ottawa"
    },
    ...
]
```

- When an item is added, removed or moved, you need to update the list to reflect the change. Specifically, the `order` value need to be updated correctly.

- Changes need to be made optimistically in the browser cache.

- They also need to be persisted on the back end.

This package gives you a deterministic way to handle it. It's designed to make sense for humans.

## Usage

```ts
const { items, instructions } = reorder(myItems, myAction);
```

Let's break it down:

#### Outputs

```ts
const { items, instructions } =
```

- `items` is a brand new array with the correct `order` values. Ready to go!
- `instructions` contains the changes that need to be made to the original array in order for the `order` values to be correct. If you need to make changes in a database, these instructions tell you exactly what changes to make.

#### Inputs

```
                              = reorder(myItems, myAction);
```

- `items` is an array of objects. Each object needs an `id` field and a `order field`.
- `action` is a redux-like action with information about the change that you want to make.

## Example

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

const { newItems, instructions } = reorder(items, {
  action: "INSERT",
  item: {
    id: "item-2",
    title: "Faro",
  },
  order: 0,
});
```

`newItems` contains a new array with all the right `order` values.

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

## Details

### Performance

https://reorder-items.netlify.app

### Order

Items and instructions may be returned in any order. This allows the underlying algoritm to simply ignore the order of the results and instead optimize for speed.

### Sources

https://blog.logrocket.com/publishing-node-modules-typescript-es-modules/
