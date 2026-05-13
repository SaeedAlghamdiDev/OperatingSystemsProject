
export function allocateMemory(strategy, blocks, processes) {
  // Create a copy of available blocks to track allocation status
  let availableBlocks = blocks.map((b) => ({ ...b, allocated: false }));

  return processes.map((process) => {
    let selectedBlockIndex = -1;

    if (strategy === "first") {
      // First Fit: Allocate to the first unused block that fits
      selectedBlockIndex = availableBlocks.findIndex(
        (b) => !b.allocated && b.size >= process.size
      );
    } else if (strategy === "best") {
      // Best Fit: Allocate to the smallest unused block that fits
      let fittingBlocks = availableBlocks
        .map((b, i) => ({ ...b, index: i }))
        .filter((b) => !b.allocated && b.size >= process.size);

      if (fittingBlocks.length > 0) {
        const best = fittingBlocks.reduce((prev, curr) =>
          prev.size < curr.size ? prev : curr
        );
        selectedBlockIndex = best.index;
      }
    } else if (strategy === "worst") {
      // Worst Fit: Allocate to the largest unused block that fits
      let fittingBlocks = availableBlocks
        .map((b, i) => ({ ...b, index: i }))
        .filter((b) => !b.allocated && b.size >= process.size);

      if (fittingBlocks.length > 0) {
        const worst = fittingBlocks.reduce((prev, curr) =>
          prev.size > curr.size ? prev : curr
        );
        selectedBlockIndex = worst.index;
      }
    }

    // If no suitable block found, return "Not Allocated"
    if (selectedBlockIndex === -1) {
      return {
        processId: process.id,
        processSize: process.size,
        allocatedBlock: "Not Allocated",
        remainingSpace: "-",
      };
    }

    // Allocate the block and record leftover space for display
    const block = availableBlocks[selectedBlockIndex];
    const remainingSpace = block.size - process.size;
    const allocatedBlockId = block.id;
    availableBlocks[selectedBlockIndex] = {
      ...block,
      allocated: true,
      remainingSpace,
    };

    return {
      processId: process.id,
      processSize: process.size,
      allocatedBlock: allocatedBlockId,
      remainingSpace: remainingSpace,
    };
  });
}
