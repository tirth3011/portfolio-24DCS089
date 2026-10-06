import React, { useState } from "react";

export default function Projects() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const projects = [
    {
      id: 1,
      title: "Task Management REST API",
      category: "backend",
      tech: ["Node.js", "Express", "REST"],
      desc: "Full CRUD API with custom logging middleware and structured error responses.",
      chunk: "practical-4"
    },
    {
      id: 2,
      title: "MongoDB Schema & Validation Pipeline",
      category: "database",
      tech: ["MongoDB", "Mongoose", "Pre-save Hook"],
      desc: "Schema design enforcing priority enums, trim hooks, and automated DB testing.",
      chunk: "practical-5"
    },
    {
      id: 3,
      title: "Full-Stack Task Manager Sync",
      category: "fullstack",
      tech: ["React 18", "Express", "MongoDB", "CORS"],
      desc: "State synchronization between React UI and MongoDB with optimistic updates.",
      chunk: "practical-6"
    },
    {
      id: 4,
      title: "JWT Authentication & Route Guards",
      category: "security",
      tech: ["JWT", "Bcrypt", "Middleware"],
      desc: "Stateless Bearer token auth, password hashing, and user-scoped task persistence.",
      chunk: "practical-7"
    },
    {
      id: 5,
      title: "React Performance & Code Splitting",
      category: "frontend",
      tech: ["React.lazy", "Suspense", "Vite", "Chunks"],
      desc: "Route-level and component-level dynamic imports yielding 69% bundle reduction.",
      chunk: "practical-8"
    }
  ];

  const filtered = projects.filter((p) => {
    const matchesCategory = filter === "all" || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span className="badge badge-purple">Lazy-Loaded Route</span>
            <span className="badge badge-cyan">Projects.chunk.js</span>
          </div>
          <h1 className="page-title">Projects Showcase</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            This page chunk was fetched dynamically only when you clicked "Projects" in the navbar.
          </p>
        </div>

        {/* Filter controls */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              padding: "0.6rem 1rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.9rem",
              outline: "none"
            }}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              padding: "0.6rem 1rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.9rem",
              outline: "none"
            }}
          >
            <option value="all">All Categories</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="database">Database</option>
            <option value="fullstack">Full-Stack</option>
            <option value="security">Security</option>
          </select>
        </div>
      </div>

      {/* Grid of Projects */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {filtered.map((proj) => (
          <div key={proj.id} className="glass-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span className="badge badge-emerald">{proj.category.toUpperCase()}</span>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                {proj.chunk}
              </span>
            </div>

            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{proj.title}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "1.25rem", minHeight: "42px" }}>
              {proj.desc}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {proj.tech.map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-color)"
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
