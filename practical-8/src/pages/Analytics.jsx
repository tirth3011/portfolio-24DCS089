import React, { lazy, Suspense, useState } from "react";
import LoadingFallback from "../components/LoadingFallback";

// Component-level lazy loading (Supplementary Problem: Lazy load heavy component on demand)
const LazyChart = lazy(() => import("../components/LazyChart"));

export default function Analytics() {
  const [showChart, setShowChart] = useState(false);

  const kpis = [
    { label: "Core Bundle Size", val: "104 KB", change: "-69.6%", status: "positive" },
    { label: "Time To Interactive", val: "240 ms", change: "3.4x faster", status: "positive" },
    { label: "Total Route Chunks", val: "5 chunks", change: "Isolated", status: "neutral" },
    { label: "Lighthouse Score", val: "99 / 100", change: "+14 pts", status: "positive" }
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span className="badge badge-purple">Lazy-Loaded Route</span>
          <span className="badge badge-cyan">Analytics.chunk.js</span>
        </div>
        <h1 className="page-title">Performance & Analytics Engine</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          Inspect application resource efficiency, chunk distribution, and on-demand component rendering.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {kpis.map((kpi, idx) => (
          <div key={idx} className="glass-card" style={{ padding: "1.25rem" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "0.4rem" }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {kpi.val}
            </div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: kpi.status === "positive" ? "var(--accent-emerald)" : "var(--accent-cyan)", marginTop: "0.25rem" }}>
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Component-level lazy load trigger */}
      <div className="glass-card" style={{ textAlign: "center", padding: "2rem" }}>
        <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          Supplementary Problem: Component-Level Dynamic Import
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "600px", margin: "0 auto 1.5rem" }}>
          Heavy charting and graph libraries shouldn't be loaded even on the analytics route until the user specifically
          requests to render the data visualization.
        </p>

        {!showChart ? (
          <button
            onClick={() => setShowChart(true)}
            className="btn btn-primary"
            style={{ padding: "0.75rem 1.75rem" }}
          >
            📊 Load Heavy Chart Component (Lazy Import)
          </button>
        ) : (
          <button
            onClick={() => setShowChart(false)}
            className="btn btn-secondary"
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}
          >
            Hide Chart
          </button>
        )}
      </div>

      {/* Heavy component inside Suspense boundary */}
      {showChart && (
        <Suspense fallback={<LoadingFallback pageName="Heavy Data Visualizer" minDelay={150} />}>
          <LazyChart />
        </Suspense>
      )}
    </div>
  );
}
