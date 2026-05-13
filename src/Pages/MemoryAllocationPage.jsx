import { useState } from "react";
import { allocateMemory } from "../JS Codes/MemoryAllocationAlgorithms";
import "./MemoryAllocation.css";

export function MemoryAllocationPage() {
  const [blocks, setBlocks] = useState([
    { id: "B1", size: 300 },
    { id: "B2", size: 200 },
    { id: "B3", size: 450 },
  ]);

  const [processes, setProcesses] = useState([
    { id: "P1", size: 150 },
    { id: "P2", size: 220 },
    { id: "P3", size: 100 },
  ]);

  const [comparisonRows, setComparisonRows] = useState(null);

  // Block handlers
  const handleBlockSizeChange = (index, newSize) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], size: Math.max(1, Number(newSize)) };
    setBlocks(updated);
  };

  const addBlock = () => {
    setBlocks([
      ...blocks,
      { id: `B${blocks.length + 1}`, size: 100 },
    ]);
  };

  const removeBlock = (index) => {
    if (blocks.length <= 1) return;
    const updated = blocks
      .filter((_, i) => i !== index)
      .map((b, i) => ({ ...b, id: `B${i + 1}` }));
    setBlocks(updated);
  };

  // Process handlers
  const handleProcessSizeChange = (index, newSize) => {
    const updated = [...processes];
    updated[index] = { ...updated[index], size: Math.max(1, Number(newSize)) };
    setProcesses(updated);
  };

  const addProcess = () => {
    setProcesses([
      ...processes,
      { id: `P${processes.length + 1}`, size: 50 },
    ]);
  };

  const removeProcess = (index) => {
    if (processes.length <= 1) return;
    const updated = processes
      .filter((_, i) => i !== index)
      .map((p, i) => ({ ...p, id: `P${i + 1}` }));
    setProcesses(updated);
  };

  const buildAllocationMap = (allocations) =>
    allocations.reduce((map, result) => {
      if (result.allocatedBlock && result.allocatedBlock !== "Not Allocated") {
        map[result.allocatedBlock] = map[result.allocatedBlock] || [];
        map[result.allocatedBlock].push({
          processId: result.processId,
          remainingSpace: result.remainingSpace,
        });
      }
      return map;
    }, {});

  const handleCalculate = () => {
    const firstResult = allocateMemory("first", blocks, processes);
    const bestResult = allocateMemory("best", blocks, processes);
    const worstResult = allocateMemory("worst", blocks, processes);

    const buildAllocations = (allocations) =>
      allocations.reduce((map, result) => {
        if (result.allocatedBlock && result.allocatedBlock !== "Not Allocated") {
          map[result.allocatedBlock] = map[result.allocatedBlock] || [];
          map[result.allocatedBlock].push({
            processId: result.processId,
            remainingSpace: result.remainingSpace,
          });
        }
        return map;
      }, {});

    const buildUnallocated = (allocations) =>
      allocations
        .filter((result) => result.allocatedBlock === "Not Allocated")
        .map((result) => result.processId);

    const firstMap = buildAllocations(firstResult);
    const bestMap = buildAllocations(bestResult);
    const worstMap = buildAllocations(worstResult);

    const rows = blocks.map((block) => ({
      id: block.id,
      size: block.size,
      first: firstMap[block.id] || [],
      best: bestMap[block.id] || [],
      worst: worstMap[block.id] || [],
    }));

    setComparisonRows({
      rows,
      unallocated: {
        first: buildUnallocated(firstResult),
        best: buildUnallocated(bestResult),
        worst: buildUnallocated(worstResult),
      },
    });
  };

  return (
    <div className="memory-allocation-container">
     
      <div className="memory-header">
        <h1>Memory Allocation Simulator</h1>
        <p>Analyze how contiguous memory allocation strategies assign processes to memory blocks</p>
      </div>

      <div className="memory-grid">
        
        <div className="memory-card">
          <h2>Memory Blocks</h2>

          <div className="blocks-table-wrapper">
            <div className="table-header">
              <div className="table-col col-label">Block ID</div>
              <div className="table-col col-size">Size (bytes)</div>
              <div className="table-col col-action"></div>
            </div>

            {blocks.map((block, index) => (
              <div key={block.id} className="table-row">
                <div className="table-col col-label">
                  <span className="block-badge">{block.id}</span>
                </div>
                <div className="table-col col-size">
                  <input
                    type="number"
                    min="100"
                    step={50}
                    value={block.size}
                    onChange={(e) => handleBlockSizeChange(index, e.target.value)}
                    className="table-input"
                    placeholder="Size in bytes"
                  />
                </div>
                <div className="table-col col-action">
                  <button
                    className="table-delete-btn"
                    onClick={() => removeBlock(index)}
                    title="Remove block"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="memory-button secondary" onClick={addBlock}>
            + Add Block
          </button>
        </div>

      
        <div className="memory-card">
          <h2>Processes</h2>

          <div className="blocks-table-wrapper">
            <div className="table-header">
              <div className="table-col col-label">Process ID</div>
              <div className="table-col col-size">Size (bytes)</div>
              <div className="table-col col-action"></div>
            </div>

            {processes.map((process, index) => (
              <div key={process.id} className="table-row">
                <div className="table-col col-label">
                  <span className="process-badge">{process.id}</span>
                </div>
                <div className="table-col col-size">
                  <input
                    type="number"
                    min="50"
                    step={50}
                    value={process.size}
                    onChange={(e) => handleProcessSizeChange(index, e.target.value)}
                    className="table-input"
                    placeholder="Size in bytes"
                  />
                </div>
                <div className="table-col col-action">
                  <button
                    className="table-delete-btn"
                    onClick={() => removeProcess(index)}
                    title="Remove process"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="memory-button secondary add-process-button" onClick={addProcess}>
            + Add Process
          </button>
          
          <button className="memory-button primary" onClick={handleCalculate}>
            Calculate Allocation
          </button>
        </div>

        {comparisonRows && (
          <div className="memory-card results-section">
            <h2>Allocation Comparison</h2>

            <div className="results-table-wrapper compare-results-wrapper">
              <div className="compare-table-header">
                <div className="results-col col-label">Block ID</div>
                <div className="results-col col-size">Block Size</div>
                <div className="results-col col-block">First Fit</div>
                <div className="results-col col-block">Best Fit</div>
                <div className="results-col col-block">Worst Fit</div>
              </div>

              {comparisonRows.rows.map((row) => (
                <div key={row.id} className="compare-table-row">
                  <div className="results-col col-label">
                    <span className="block-badge">{row.id}</span>
                  </div>
                  <div className="results-col col-size">
                    {row.size} bytes
                  </div>
                  {['first', 'best', 'worst'].map((strategy) => {
                    const allocation = row[strategy];
                    const isFree = allocation.length === 0;
                    const labelText = isFree
                      ? 'Free'
                      : allocation.map((item) => item.processId).join(', ');
                    return (
                      <div key={strategy} className="results-col col-block">
                        {isFree ? (
                          <span className="free-badge">Free</span>
                        ) : (
                          <span className="allocated-badge">{labelText}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              <div className="compare-table-row compare-table-footer">
                <div className="results-col col-label">
                  <span className="result-badge">Not Allocated</span>
                </div>
                <div className="results-col col-size"></div>
                {['first', 'best', 'worst'].map((strategy) => {
                  const missing = comparisonRows.unallocated[strategy];
                  const labelText = missing.length === 0 ? 'None' : missing.join(', ');
                  return (
                    <div key={strategy} className="results-col col-block">
                      {missing.length === 0 ? (
                        <span className="free-badge">None</span>
                      ) : (
                        <span className="unallocated-badge">{labelText}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
