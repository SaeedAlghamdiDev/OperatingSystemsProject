
export function allocateMemory(strategy, blocks, processes) {
  // Create a copy of available blocks to track remaining space
  let availableBlocks = blocks.map((b) => ({ ...b }));

  return processes.map((process) => {
    let selectedBlockIndex = -1;

    if (strategy === "first") {
      // First Fit: Allocate to the first block that fits
      selectedBlockIndex = availableBlocks.findIndex(
        (b) => b.size >= process.size
      );
    } else if (strategy === "best") {
      // Best Fit: Allocate to the smallest block that fits
      let fittingBlocks = availableBlocks
        .map((b, i) => ({ ...b, index: i }))
        .filter((b) => b.size >= process.size);

      if (fittingBlocks.length > 0) {
        const best = fittingBlocks.reduce((prev, curr) =>
          prev.size < curr.size ? prev : curr
        );
        selectedBlockIndex = best.index;
      }
    } else if (strategy === "worst") {
      // Worst Fit: Allocate to the largest block that fits
      let fittingBlocks = availableBlocks
        .map((b, i) => ({ ...b, index: i }))
        .filter((b) => b.size >= process.size);

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

    // Calculate remaining space and update block
    const remainingSpace = availableBlocks[selectedBlockIndex].size - process.size;
    const allocatedBlockId = availableBlocks[selectedBlockIndex].id;
    availableBlocks[selectedBlockIndex].size = remainingSpace;

    return {
      processId: process.id,
      processSize: process.size,
      allocatedBlock: allocatedBlockId,
      remainingSpace: remainingSpace,
    };
  });
}
