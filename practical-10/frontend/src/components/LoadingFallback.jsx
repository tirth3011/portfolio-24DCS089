import React, { useState, useEffect } from "react";

export default function LoadingFallback({ pageName = "Route Chunk", minDelay = 250 }) {
  const [visible, setVisible] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // Supplementary requirement: Prevent flashing on instantaneous connections
    const timer = setTimeout(() => {
      setVisible(true);
    }, minDelay);

    const interval = setInterval(() => {
      setElapsed((prev) => prev + 50);
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [minDelay]);

  if (!visible) return null;

  return (
    <div className="skeleton-container">
      <div className="skeleton-header">
        <div className="spinner"></div>
        <div>
          <h3 style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Downloading <span style={{ color: "var(--accent-cyan)" }}>{pageName}</span>
            <span className="badge badge-cyan" style={{ fontSize: "0.7rem" }}>
              React.Suspense
            </span>
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
            Dynamic import in progress: chunk loading over network ({elapsed}ms elapsed)
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
        <div className="skeleton-shimmer" style={{ height: "38px", width: "45%" }}></div>
        <div className="skeleton-shimmer" style={{ height: "18px", width: "80%" }}></div>
        <div className="skeleton-shimmer" style={{ height: "18px", width: "65%" }}></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
        <div className="skeleton-shimmer" style={{ height: "120px" }}></div>
        <div className="skeleton-shimmer" style={{ height: "120px" }}></div>
        <div className="skeleton-shimmer" style={{ height: "120px" }}></div>
      </div>
    </div>
  );
}
