import { Action, OrderedItem } from "../src/reorder.types.js";
import { reorder } from "../src/reorder.js";

const NUMBER_OF_RUNS_PER_TEST = 3;
const START_MARKER = "runTest started";
const END_MARKER = "runTest ended";

function runTest(numberOfItems: number, action: Action) {
  const items: OrderedItem[] = [];

  for (var i = 0; i < numberOfItems; i++) {
    items.push({
      id: i.toString(),
      order: i,
      foo: "bar",
    });
  }

  const measureId = Math.random().toString();

  for (var i = 0; i < NUMBER_OF_RUNS_PER_TEST; i++) {
    performance.mark(START_MARKER);
    const result = reorder(items, action);
    performance.mark(END_MARKER);
    performance.measure(measureId, START_MARKER, END_MARKER);
  }

  const performanceEntries = performance.getEntriesByName(measureId);

  let totalDuration = 0;
  performanceEntries.forEach((entry) => (totalDuration += entry.duration));
  const averageDuration = totalDuration / NUMBER_OF_RUNS_PER_TEST;
  return averageDuration;
}

function runAllTests() {
  let results: {
    name: string;
    results: { name: string; description: string; duration: number }[];
  }[] = [];

  let insertGroup = { name: "INSERT actions", results: [] };
  for (var i = 0; i <= 100000; i += 10000) {
    insertGroup.results.push({
      name: `Testing with ${i} items`,
      description: "",
      duration: runTest(i, {
        type: "INSERT",
        item: { id: "foo" },
        order: 0,
      }),
    });
  }
  results.push(insertGroup);

  let removeGroup = { name: "REMOVE actions", results: [] };
  for (var i = 0; i <= 1000000; i += 25000) {
    removeGroup.results.push({
      name: `Testing with ${i} items`,
      description: "",
      duration: runTest(i, {
        type: "REMOVE",
        id: "0",
      }),
    });
  }
  results.push(removeGroup);

  return results;
}

const $runBtn = document.querySelector("#run") as HTMLButtonElement;
$runBtn.onclick = () => {
  const results = runAllTests();
  let outputHTML = "";

  results.forEach((group) => {
    outputHTML += `<h3>${group.name}</h3>`;
    outputHTML += `<ul>`;
    group.results.forEach((result) => {
      outputHTML += `<li>
      <span>${result.name}:</span> 
      <span>${result.duration.toFixed(2)}ms</span>
      <span style="width: ${result.duration * 3}px;"></span>
      </li>`;
    });
    outputHTML += `</ul>`;
  });

  document.querySelector("#results").innerHTML = outputHTML;
};
