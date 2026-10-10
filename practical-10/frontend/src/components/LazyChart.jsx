import React, { useState } from "react";

export default function LazyChart() {
  const [metricType, setMetricType] = useState("bundle");

  const bundleData = [
    { label: "Practical 2/3 (Monolithic)", sizeKb: 342, initialLoadMs: 820, color: "#f43f5e" },
    { label: "Practical 8 Initial Chunk", sizeKb: 104, initialLoadMs: 240, color: "#38bdf8" },
    { label: "Projects Chunk (Deferred)", sizeKb: 48, initialLoadMs: 95, color: "#a855f7" },
    { label: "Analytics Chunk (Deferred)", sizeKb: 72, initialLoadMs: 140, color: "#10b981" },
    { label: "Contact Chunk (Deferred)", sizeKb: 36, initialLoadMs: 70, color: "#f59e0b" }
  ];

  const maxVal = metricType === "bundle" ? 350 : 850;

  return (
    <div className="glass-card" style={{ marginTop: "1.5rem", border: "1px solid rgba(168, 85, 247, 0.3)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="badge badge-purple">Lazy-Loaded Heavy Component</span>
            <span className="badge badge-cyan">Dynamic Chunk: LazyChart.jsx</span>
          </div>
          <h3 style={{ fontSize: "1.3rem", marginTop: "0.5rem" }}>
            Real-Time Code Splitting & Performance Diagnostics
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            This charting visualizer was loaded dynamically on demand using <code>React.lazy()</code>.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setMetricType("bundle")}
            className={`btn ${metricType === "bundle" ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem" }}
          >
            Bundle Size (KB)
          </button>
          <button
            onClick={() => setMetricType("load")}
            className={`btn ${metricType === "load" ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem" }}
          >
            Load Time (ms)
          </button>
        </div>
      </div>

      {/* SVG Bar Chart Visualization */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", margin: "1.5rem 0" }}>
        {bundleData.map((item, idx) => {
          const val = metricType === "bundle" ? item.sizeKb : item.initialLoadMs;
          const pct = Math.round((val / maxVal) * 100);

          return (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                <span style={{ fontWeight: 600 }}>{item.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: item.color, fontWeight: 700 }}>
                  {val} {metricType === "bundle" ? "KB" : "ms"} ({pct}%)
                </span>
              </div>
              <div style={{ width: "100%", height: "14px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "999px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${item.color}88, ${item.color})`,
                    borderRadius: "999px",
                    transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "1rem", background: "rgba(0,0,0,0.3)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", fontSize: "0.85rem" }}>
        <div>
          <span style={{ color: "var(--text-muted)" }}>Initial Payload Reduction: </span>
          <strong style={{ color: "var(--accent-emerald)" }}>69.6% smaller initial bundle</strong>
        </div>
        <div>
          <span style={{ color: "var(--text-muted)" }}>Time to Interactive (TTI): </span>
          <strong style={{ color: "var(--accent-cyan)" }}>3.4x faster initial render</strong>
        </div>
      </div>
    </div>
  );
}
