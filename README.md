<h1 align="center">reorder-items</h1>

<p align="center">A helpful algorithm for persisting the order of items.</p>

<p align="center">0.7kb minified + gzipped &bull; No dependencies &bull; <a href="#usage">How to use it</a></p>

<div align="center">
    <a href="https://www.travis-ci.com/martenbjork/reorder-items">
        <img src="https://www.travis-ci.com/martenbjork/reorder-items.svg?branch=main" alt="Build status">
    </a>
</div>

## Use case

You're building a UI containing lists. Users can change the order of items in the lists. (Trello, Todoist...) 

<img src="ui-example.png" width="377" alt="UI illustrating a draggable list where one item is being moved up" />

Your database stores the items along with an `order` field:
```
ID                                    | Order
--------------------------------------|------------------------
af84c0bd-342d-4495-b16d-2aadf3cb74b3  | 0
e34094bf-e62a-4056-b145-d5698cf8bb9d  | 1
```

Your front end fetches these items and stores them as state:

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

- When an item is added, removed or moved, the data above needs to be re-calculated.
    - **Adding items:** The new item needs a correct `order` value. Items below need to have their `order` increased since they are moved down by 1.
    - **Removing items:*** Suddenly there is a gap in the `order` sequence. Remaining items need to have their `order` re-computed.
    - **Moving items:** All items below the new one needs new `order` values since they were moved too (as a side effect).

- These changes need to be instantaneous in the state & UI. They also need to be persisted on the back end.

- This logic needs to be predictable and rock solid so that the UI and back end has the same `order` values.

<strong>🌸 This package helps you implement this logic without headaches.</strong>

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
            <p><code>instructions</code> tell you what changes <i>you</i> need to be make to the existing data in order to achieve the desired state.</p>

<p>This is useful when you need to persist changes to a database.</p>


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
  <p><code>action</code> is a redux-like action that expressed the change that you want to make to the list.</p>

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

## Example implementation

![Schematic showing how data flows from the UI to the front end and then the back end](./schematic.png)

#### Step 1: Fetching data

Your UI contains a list of cities. 

```ts
const [cities, setCities) = useState([]);
```

City data can be fetched at `/api/getCityList`:

```ts
[
  {
    id: "af84c0bd-342d-4495-b16d-2aadf3cb74b3",
    order: 0,
    title: "Stockholm",
  },
  {
    id: "e34094bf-e62a-4056-b145-d5698cf8bb9d",
    order: 1,
    title: "Ottawa",
  }
]
```
We fetch these items and put them in the state:

```ts
setCities(res.data.getCityList);
```

Now we got cities in the state. We show the cities in the UI.

#### Step 2: Adding to the list

Users can add a new city to the list. We set up a handler for this:

```ts
const addCity = (title: string, order: number) => {
  // Describe what needs to happen
  const action : Action = {
    action: "INSERT",
    item: { id: uuid(), title },
    order,
  };

  // Compute new values for the list
  const { items: updatedCities } = reorder(cities, action);

  // Save to state
  setCities(updatedCities)
}
```

Because `reorder` took care of the logic, the `cities` state now equals:

```ts
[
  // New item
  {
    id: "b5f2ebcd-41c2-427e-a8fb-987bdc02b375",
    order: 0,
    title: "My new city",
  },
  // Updated items
  {
    id: "af84c0bd-342d-4495-b16d-2aadf3cb74b3",
    order: 1, // Increased by 1
    title: "Stockholm",
  },
  {
    id: "e34094bf-e62a-4056-b145-d5698cf8bb9d",
    order: 2, // Increased by 1
    title: "Ottawa",
  }
]
```

#### Step 3: Persisting the changes

The updated list is now reflected in the UI, but we still need to persist the order to the back end. We send an API request to the `addCity` endpoint. 

```ts
POST /api/addCity

data: {
  id, title, order
}
```

On the server, a resolver handles the request:

```ts
const addCityResolver = (args: MutationArgs) => {
  const items = db.find(...);

  // Describe what needs to happen
  const action : Action = {
    action: "INSERT",
    item: { id: args.id, title: args.title },
    order: args.order,
  };

  // Run the same function that we ran on the front end.
  // However, this time, we get the 'instructions'.
  const { instructions } = reorder(cities, action);

  // We loop through the instructions and
  // simply do what they tell us.
  instructions.forEach(instruction => {
    switch(instruction.type) {
      case "INSERT";
        db.cities.insert();
        break;

      case "UPDATE":
        db.cities.update({
          id: instruction.id,
          order: instruction.order
        });
        break;
    }
  })
}
```

Because the front end and back end both used the `reorder` function to compute new list values, they end up with the same result.

The data is now the same in the state and database. 🌻

--- 

## Details

### Performance

Performance tests and profiling can be run through the browser:

https://reorder-items.netlify.app

### Order

Items and instructions may be returned in any order. This allows the underlying algoritm to simply ignore the order of the results and instead optimize for speed.

### Sources

https://blog.logrocket.com/publishing-node-modules-typescript-es-modules/
