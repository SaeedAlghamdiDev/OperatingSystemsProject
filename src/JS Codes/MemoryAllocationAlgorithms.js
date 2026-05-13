
export function allocateMemory(strategy, blocks, processes) {
 
  let availableBlocks = blocks.map((b) => ({ ...b, allocated: false }));

  return processes.map((process) => {
    let selectedBlockIndex = -1;

    if (strategy === "first") {
      
      selectedBlockIndex = availableBlocks.findIndex(
        (b) => !b.allocated && b.size >= process.size
      );
    } else if (strategy === "best") {
     
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

  
    if (selectedBlockIndex === -1) {
      return {
        processId: process.id,
        processSize: process.size,
        allocatedBlock: "Not Allocated",
        remainingSpace: "-",
      };
    }

    
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
