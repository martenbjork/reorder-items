import { reorder } from "./src/reorder";
import { SortableItem } from "./src/reorder.types";

function measurePerformance(runs: number, columns: number, rows: number) {
  let grid: SortableItem[] = [];

  for (var column = 0; column < columns; column++) {
    for (var order = 0; order < rows; order++) {
      grid.push({
        id: `${column}-${order}`,
        column,
        order,
      });
    }
  }

  const testId = `${runs} MOVE operations on a ${columns} x ${rows} grid`;

  console.time(testId);
  for (var i = 0; i < runs; i++) {
    reorder(grid, {
      type: "MOVE",
      id: "0-0",
      toColumn: 1,
      toOrder: 1,
    });
  }
  console.timeEnd(testId);
}

// Increasing number of runs
measurePerformance(100, 100, 100);
measurePerformance(200, 100, 100);
measurePerformance(300, 100, 100);

// Increasing scale of grid
measurePerformance(100, 10, 100);
measurePerformance(100, 100, 100);
measurePerformance(100, 1000, 100);
measurePerformance(100, 10000, 100);
measurePerformance(100, 100, 10);
measurePerformance(100, 100, 100);
measurePerformance(100, 100, 1000);
measurePerformance(100, 100, 10000);
