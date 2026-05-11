import { useState } from "react";
import { allocateMemory } from "../JS Codes/MemoryAllocationAlgorithms";
import "./MemoryAllocation.css";

export function MemoryAllocationPage() {
  const [blocks, setBlocks] = useState([]);

  const [processes, setProcesses] = useState([]);

  const [strategy, setStrategy] = useState("first");
  const [results, setResults] = useState(null);

  // Block handlers
  const handleBlockSizeChange = (index, newSize) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], size: Math.max(1, Number(newSize)) };
    setBlocks(updated);
    setResults(null);
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
    setResults(null);
  };

  // Process handlers
  const handleProcessSizeChange = (index, newSize) => {
    const updated = [...processes];
    updated[index] = { ...updated[index], size: Math.max(1, Number(newSize)) };
    setProcesses(updated);
    setResults(null);
  };

  const addProcess = () => {
    setProcesses([
      ...processes,
      { id: `P${processes.length + 1}`, size: 100 },
    ]);
  };

  const removeProcess = (index) => {
    if (processes.length <= 1) return;
    const updated = processes
      .filter((_, i) => i !== index)
      .map((p, i) => ({ ...p, id: `P${i + 1}` }));
    setProcesses(updated);
    setResults(null);
  };

  // Calculate allocation
  const handleCalculate = () => {
    const allocationResults = allocateMemory(strategy, blocks, processes);
    setResults(allocationResults);
  };

  return (
    <div className="memory-allocation-container">
      {/* Header */}
      <div className="memory-header">
        <h1>Memory Allocation Simulator</h1>
        <p>Analyze how contiguous memory allocation strategies assign processes to memory blocks</p>
      </div>

      <div className="memory-grid">
        {/* LEFT COLUMN - INPUT SECTION */}
        <div className="memory-card">
          <h2>Memory Blocks</h2>

          <div className="blocks-table-wrapper">
            <div className="table-header">
              <div className="table-col col-label">Block ID</div>
              <div className="table-col col-size">Size (KB)</div>
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
                    min="1"
                    value={block.size}
                    onChange={(e) => handleBlockSizeChange(index, e.target.value)}
                    className="table-input"
                    placeholder="Size in KB"
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

        {/* RIGHT COLUMN - PROCESSES SECTION */}
        <div className="memory-card">
          <h2>Processes</h2>

          <div className="blocks-table-wrapper">
            <div className="table-header">
              <div className="table-col col-label">Process ID</div>
              <div className="table-col col-size">Size (KB)</div>
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
                    min="1"
                    value={process.size}
                    onChange={(e) => handleProcessSizeChange(index, e.target.value)}
                    className="table-input"
                    placeholder="Size in KB"
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

          <button className="memory-button secondary" onClick={addProcess}>
            + Add Process
          </button>
        </div>

        {/* STRATEGY SELECTION */}
        <div className="memory-card strategy-section">
          <h2>Allocation Strategy</h2>
          <div className="strategy-grid">
            {[
              ["first", "First Fit", "Allocates to the first block that fits"],
              ["best", "Best Fit", "Allocates to the smallest suitable block"],
              ["worst", "Worst Fit", "Allocates to the largest available block"],
            ].map(([value, label, description]) => (
              <div key={value} className="strategy-option">
                <input
                  type="radio"
                  id={`strategy-${value}`}
                  name="strategy"
                  value={value}
                  checked={strategy === value}
                  onChange={(e) => {
                    setStrategy(e.target.value);
                    setResults(null);
                  }}
                  className="strategy-radio"
                />
                <label htmlFor={`strategy-${value}`} className="strategy-label">
                  <div className="strategy-title">{label}</div>
                  <div className="strategy-desc">{description}</div>
                </label>
              </div>
            ))}
          </div>

          <button className="memory-button primary" onClick={handleCalculate}>
            Calculate Allocation
          </button>
        </div>

        {/* RESULTS SECTION */}
        {results && (
          <div className="memory-card results-section">
            <h2>Allocation Results</h2>

            <div className="strategy-badge">
              Strategy: {strategy === "first" ? "First Fit" : strategy === "best" ? "Best Fit" : "Worst Fit"}
            </div>

            <div className="results-table-wrapper">
              <div className="results-header">
                <div className="results-col col-process">Process</div>
                <div className="results-col col-size">Process Size</div>
                <div className="results-col col-block">Allocated Block</div>
                <div className="results-col col-remaining">Remaining Space</div>
              </div>

              {results.map((result, index) => {
                const isUnallocated = result.allocatedBlock === "Not Allocated";
                return (
                  <div
                    key={index}
                    className={`results-row ${isUnallocated ? "unallocated" : "allocated"}`}
                  >
                    <div className="results-col col-process">
                      <span className="result-badge">{result.processId}</span>
                    </div>
                    <div className="results-col col-size">
                      {result.processSize} KB
                    </div>
                    <div className="results-col col-block">
                      {isUnallocated ? (
                        <span className="unallocated-badge">Not Allocated</span>
                      ) : (
                        <span className="allocated-badge">{result.allocatedBlock}</span>
                      )}
                    </div>
                    <div className="results-col col-remaining">
                      {result.remainingSpace === "-"
                        ? "-"
                        : `${result.remainingSpace} KB`}
                    </div>
                  </div>
                );
              })}
            </div>

            
            <div className="results-summary">
              <div className="summary-stat">
                <div className="stat-label">Total Blocks</div>
                <div className="stat-value">{blocks.length}</div>
              </div>
              <div className="summary-stat">
                <div className="stat-label">Total Processes</div>
                <div className="stat-value">{processes.length}</div>
              </div>
              <div className="summary-stat">
                <div className="stat-label">Allocated Processes</div>
                <div className="stat-value">
                  {results.filter((r) => r.allocatedBlock !== "Not Allocated").length}
                </div>
              </div>
              <div className="summary-stat">
                <div className="stat-label">Failed Allocations</div>
                <div className="stat-value">
                  {results.filter((r) => r.allocatedBlock === "Not Allocated").length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
