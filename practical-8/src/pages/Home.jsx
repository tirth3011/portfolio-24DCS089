import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ textAlign: "center", padding: "2rem 0 3rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <span className="badge badge-cyan">Practical 8: Front-End Optimization</span>
          <span className="badge badge-purple">React.lazy() + Suspense</span>
        </div>

        <h1 className="page-title" style={{ fontSize: "2.75rem", maxWidth: "850px", margin: "0 auto 1rem" }}>
          Performance Optimization & Route-Based Code Splitting
        </h1>

        <p className="page-subtitle" style={{ maxWidth: "700px", margin: "0 auto 2rem" }}>
          Demonstrating client-side bundle decomposition in React. Instead of shipping a monolithic bundle upfront,
          application routes and heavy dependencies are split into independent asynchronous chunks.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link to="/projects" className="btn btn-primary">
            Explore Lazy Projects →
          </Link>
          <Link to="/analytics" className="btn btn-secondary">
            View Heavy Chart Dashboard
          </Link>
          <Link to="/benchmark" className="btn btn-secondary">
            Bundle Metrics & Benchmarks
          </Link>
        </div>
      </section>

      {/* Architecture Before vs After Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", margin: "2rem 0" }}>
        {/* Monolithic Architecture */}
        <div className="glass-card" style={{ borderColor: "rgba(244, 63, 94, 0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span className="badge badge-amber">Before Optimization (Monolithic)</span>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-rose)", fontWeight: 700 }}>Single Huge Payload</span>
          </div>

          <h3 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>All Routes Bundled Upfront</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
            The browser is forced to download, parse, and execute all application routes (Home, Projects, Analytics, Contact)
            before rendering even the landing page.
          </p>

          <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: "var(--radius-sm)", padding: "1rem", fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#fda4af" }}>
            <div>main.bundle.js [~342 KB]</div>
            <div style={{ paddingLeft: "1rem", color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.35rem" }}>
              ├── Home.jsx (bundled)<br />
              ├── Projects.jsx (bundled)<br />
              ├── Contact.jsx (bundled)<br />
              └── HeavyCharts.jsx (bundled)
            </div>
            <div style={{ marginTop: "0.75rem", color: "var(--accent-rose)", fontWeight: 600 }}>
              ⚠ Slow initial paint (FCP), delayed Time-To-Interactive (TTI)
            </div>
          </div>
        </div>

        {/* Code-Split Architecture */}
        <div className="glass-card" style={{ borderColor: "rgba(56, 189, 248, 0.4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span className="badge badge-emerald">After Optimization (Code-Split)</span>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-emerald)", fontWeight: 700 }}>On-Demand Chunks</span>
          </div>

          <h3 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>Granular Asynchronous Chunks</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
            The initial payload contains only the lightweight entry shell. Routes and heavy data visualizers load
            in the background only when the user navigates to them.
          </p>

          <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: "var(--radius-sm)", padding: "1rem", fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#7dd3fc" }}>
            <div>index.chunk.js [~104 KB] <span style={{ color: "var(--accent-emerald)" }}>(Initial Load)</span></div>
            <div style={{ paddingLeft: "1rem", color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.35rem" }}>
              ├── Projects-chunk.js (loaded on /projects)<br />
              ├── Analytics-chunk.js (loaded on /analytics)<br />
              ├── Contact-chunk.js (loaded on /contact)<br />
              └── LazyChart-chunk.js (deferred heavy component)
            </div>
            <div style={{ marginTop: "0.75rem", color: "var(--accent-emerald)", fontWeight: 600 }}>
              ✔ 69.6% smaller initial JS payload, instant first render!
            </div>
          </div>
        </div>
      </div>

      {/* Code Implementation Preview Card */}
      <div className="glass-card" style={{ marginTop: "2rem" }}>
        <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          How Code Splitting is Implemented in React 18
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
          Using native <code>React.lazy()</code> with dynamic ES Module imports combined with <code>&lt;Suspense&gt;</code> fallback boundaries.
        </p>

        <pre style={{
          background: "#030712",
          padding: "1.25rem",
          borderRadius: "var(--radius-sm)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.85rem",
          color: "#e2e8f0",
          overflowX: "auto",
          border: "1px solid var(--border-color)"
        }}>
{`// 1. Dynamic Imports with React.lazy
const Projects = lazy(() => import("./pages/Projects"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Contact = lazy(() => import("./pages/Contact"));

// 2. Wrap Routes inside Suspense boundary with custom fallback
<Suspense fallback={<LoadingFallback pageName="Requested Route" />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/analytics" element={<Analytics />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</Suspense>`}
        </pre>
      </div>
    </div>
  );
}
