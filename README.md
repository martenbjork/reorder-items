# reorder-items

A helpful algorithm for sorting arrays of objects.

- 0.7kb minified + gzipped
- No dependencies

Installation: `yarn add reorder` 👉 [How to use it](#Usage)

[![Build Status](https://www.travis-ci.com/martenbjork/reorder-items.svg?branch=main)](https://www.travis-ci.com/martenbjork/reorder-items)

## Use case

You have an array of objects. Each object contains an `id` and an `order` value.

```
[
    {
        id: "item-0",
        order: 0,
        title: "Stockholm"
    },
    {
        id: "item-1",
        order: 1,
        title: "Stockholm"
    },
    ...
]
```

- When an item is added, removed or moved in this list, you need to update the list to reflect the change. Specifically, the `order` value need to be updated correctly.

- Changes need to be made optimistically in the browser cache.

- They need to be persisted on the back end.

This package gives you a deterministic way to handle it.

## Usage

## Details

### Performance

https://reorder-items.netlify.app

### Order

Items and instructions may be returned in any order. This allows the underlying algoritm to simply ignore the order of the results and instead optimize for speed.

### Sources

https://blog.logrocket.com/publishing-node-modules-typescript-es-modules/
