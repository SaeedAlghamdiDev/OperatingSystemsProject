
import { useState } from "react";
import {
  runFIFO,
  runLRU,
  runOptimal,
} from "../JS Codes/PageReplacementAlgorithms";
import "./PageReplacement.css";

export function PageReplacementPage() {
  const [frameCount, setFrameCount] = useState(3);
  const [referenceString, setReferenceString] = useState("");
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    // Parse reference string into array of numbers
    const refs = referenceString
      .trim()
      .split(/\s+/)
      .map(Number)
      .filter((n) => !isNaN(n));

    if (refs.length === 0 || frameCount < 1) {
      return;
    }

    // Run all three algorithms
    const fifoResult = runFIFO(frameCount, refs);
    const lruResult = runLRU(frameCount, refs);
    const optimalResult = runOptimal(frameCount, refs);

    setResults({
      fifo: fifoResult,
      lru: lruResult,
      optimal: optimalResult,
      refs,
      frameCount,
    });
  };

  const handleReset = () => {
    setReferenceString("");
    setFrameCount(3);
    setResults(null);
  };

  return (
    <div className="page-replacement-container">
      {/* Header */}
      <div className="page-header">
        <h1>Page Replacement Simulator</h1>
        <p>Compare FIFO, LRU, and Optimal page replacement algorithms</p>
      </div>

      <div className="page-grid">
        {/* INPUT SECTION */}
        <div className="page-card">
          <h2>Configuration</h2>

          <div className="input-section">
            <div className="form-group">
              <label>
                Number of Frames
                <div className="label-hint">(Memory frames available)</div>
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={frameCount}
                onChange={(e) => setFrameCount(Number(e.target.value))}
                className="page-input"
                placeholder="Enter number of frames"
              />
            </div>

            <div className="form-group">
              <label>
                Page Reference String
                <div className="label-hint">(Space-separated page numbers)</div>
              </label>
              <textarea
                value={referenceString}
                onChange={(e) => setReferenceString(e.target.value)}
                className="page-textarea"
                placeholder="Example: 1 2 3 4 5"
                rows="4"
              />
            </div>

            <div className="button-group">
              <button className="page-button primary" onClick={handleCalculate}>
                Calculate All Algorithms
              </button>
              <button className="page-button secondary" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS SECTION */}
        {results && (
          <>
            {/* SUMMARY TABLE */}
            <div className="page-card results-summary-card">
              <h2>Summary Comparison</h2>

              <div className="summary-table-wrapper">
                <div className="summary-header">
                  <div className="summary-col col-algo">Algorithm</div>
                  <div className="summary-col col-faults">Page Faults</div>
                  <div className="summary-col col-hits">Hits</div>
                  <div className="summary-col col-ratio">Hit Ratio</div>
                </div>

                {[
                  ["FIFO", results.fifo],
                  ["LRU", results.lru],
                  ["Optimal", results.optimal],
                ].map(([name, data]) => {
                  const hitRatio = (
                    (data.hits / results.refs.length) *
                    100
                  ).toFixed(1);
                  const missRatio = (
                    (data.faults / results.refs.length) *
                    100
                  ).toFixed(1);

                  return (
                    <div key={name} className="summary-row">
                      <div className="summary-col col-algo">
                        <span className="algo-badge">{name}</span>
                      </div>
                      <div className="summary-col col-faults">
                        <span className="fault-value">{data.faults}</span>
                      </div>
                      <div className="summary-col col-hits">
                        <span className="hit-value">{data.hits}</span>
                      </div>
                      <div className="summary-col col-ratio">
                        <span className="ratio-primary">{hitRatio}%</span>
                        <span className="ratio-secondary">{missRatio}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DETAILED ALGORITHM RESULTS */}
            {[
              ["FIFO", results.fifo],
              ["LRU", results.lru],
              ["Optimal", results.optimal],
            ].map(([name, data]) => (
              <div key={name} className="page-card algorithm-detail">
                <h2>{name} Page Replacement</h2>

                <div className="algorithm-info">
                  <div className="info-box">
                    <div className="info-label">Page Faults</div>
                    <div className="info-value fault">{data.faults}</div>
                  </div>
                  <div className="info-box">
                    <div className="info-label">Cache Hits</div>
                    <div className="info-value hit">{data.hits}</div>
                  </div>
                  <div className="info-box">
                    <div className="info-label">Hit Ratio</div>
                    <div className="info-value">
                      {((data.hits / results.refs.length) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="info-box">
                    <div className="info-label">Total References</div>
                    <div className="info-value">{results.refs.length}</div>
                  </div>
                </div>

                <h3>Step-by-Step Trace</h3>

                <div className="page-trace">
                  {/* Reference numbers row */}
                  <div className="trace-row reference-row">
                    <div className="trace-label">Reference</div>
                    {data.steps.map((step, i) => (
                      <div
                        key={i}
                        className={`trace-cell reference-cell ${
                          step.isFault ? "fault" : "hit"
                        }`}
                      >
                        <span className="page-number">{step.page}</span>
                        <span className="fault-indicator">
                          {step.isFault ? "F" : "H"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Memory frames rows */}
                  {Array.from({ length: results.frameCount }, (_, frameIdx) => (
                    <div key={`frame-${frameIdx}`} className="trace-row">
                      <div className="trace-label">Frame {frameIdx + 1}</div>
                      {data.steps.map((step, stepIdx) => (
                        <div key={stepIdx} className="trace-cell frame-cell">
                          {step.memory[frameIdx] !== undefined
                            ? step.memory[frameIdx]
                            : "-"}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="trace-legend">
                  <div className="legend-item">
                    <span className="legend-indicator fault"></span>
                    <span className="legend-text">Page Fault (new page loaded)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-indicator hit"></span>
                    <span className="legend-text">Cache Hit (page already in memory)</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}