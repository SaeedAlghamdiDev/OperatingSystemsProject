
export function runFIFO(frameCount, referenceString) {
  let memory = [];
  let faults = 0;
  let steps = [];

  for (let page of referenceString) {
    let isFault = false;

    if (!memory.includes(page)) {
      isFault = true;
      faults++;

    
      if (memory.length >= frameCount) {
        memory.shift();
      }

      memory.push(page);
    }

    steps.push({ page, memory: [...memory], isFault });
  }

  return {
    faults,
    hits: referenceString.length - faults,
    steps,
  };
}


export function runLRU(frameCount, referenceString) {
  let memory = [];
  let faults = 0;
  let steps = [];

  for (let i = 0; i < referenceString.length; i++) {
    let page = referenceString[i];
    let isFault = false;

    if (!memory.includes(page)) {
      isFault = true;
      faults++;

      if (memory.length >= frameCount) {
       
        let lruIndex = memory.reduce((minIdx, currentPage, currentIdx) => {
          let lastUseOfCurrent = referenceString.slice(0, i).lastIndexOf(currentPage);
          let lastUseOfMin = referenceString
            .slice(0, i)
            .lastIndexOf(memory[minIdx]);

          return lastUseOfCurrent < lastUseOfMin ? currentIdx : minIdx;
        }, 0);

        memory.splice(lruIndex, 1);
      }

      memory.push(page);
    }

    steps.push({ page, memory: [...memory], isFault });
  }

  return {
    faults,
    hits: referenceString.length - faults,
    steps,
  };
}


export function runOptimal(frameCount, referenceString) {
  let memory = [];
  let faults = 0;
  let steps = [];

  for (let i = 0; i < referenceString.length; i++) {
    let page = referenceString[i];
    let isFault = false;

    if (!memory.includes(page)) {
      isFault = true;
      faults++;

      if (memory.length >= frameCount) {
        // Find the page that will be used furthest in the future
        let futureUses = memory.map((memPage) => {
          let nextUse = referenceString.indexOf(memPage, i + 1);
          return {
            page: memPage,
            nextUseIndex: nextUse === -1 ? Infinity : nextUse,
          };
        });

       
        futureUses.sort((a, b) => b.nextUseIndex - a.nextUseIndex);

        
        let pageToRemove = futureUses[0].page;
        memory.splice(memory.indexOf(pageToRemove), 1);
      }

      memory.push(page);
    }

    steps.push({ page, memory: [...memory], isFault });
  }

  return {
    faults,
    hits: referenceString.length - faults,
    steps,
  };
}
