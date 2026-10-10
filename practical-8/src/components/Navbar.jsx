import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onOpenAuth, onOpenCreate }) {
  const { user, isAuthenticated, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="nav-wrapper">
        <NavLink to="/" className="nav-brand" style={{ textDecoration: "none" }}>
          <div className="brand-icon" style={{
            width: "38px",
            height: "38px",
            borderRadius: "var(--radius-sm)",
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)"
          }}>
            ⚡
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)" }}>TaskGuard</span>
              <span style={{
                fontSize: "0.68rem",
                fontFamily: "var(--font-mono)",
                background: "rgba(56, 189, 248, 0.15)",
                color: "#38bdf8",
                padding: "2px 6px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid rgba(56, 189, 248, 0.3)"
              }}>
                P8 • Lazy Loading
              </span>
            </div>
            <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>
              React.lazy() • Suspense • Code Splitting
            </span>
          </div>
        </NavLink>

        <ul className="nav-links" style={{ listStyle: "none", display: "flex", gap: "8px", margin: 0, padding: 0, alignItems: "center" }}>
          <li>
            <NavLink to="/" end className={({ isActive }) => `btn ${isActive ? "btn-secondary" : "btn-icon"}`} style={{ textDecoration: "none", fontSize: "0.85rem", padding: "6px 12px" }}>
              📋 Tasks
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics" className={({ isActive }) => `btn ${isActive ? "btn-secondary" : "btn-icon"}`} style={{ textDecoration: "none", fontSize: "0.85rem", padding: "6px 12px" }}>
              📊 Analytics <span style={{ fontSize: "0.68rem", color: "#38bdf8" }}>(lazy)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects" className={({ isActive }) => `btn ${isActive ? "btn-secondary" : "btn-icon"}`} style={{ textDecoration: "none", fontSize: "0.85rem", padding: "6px 12px" }}>
              📁 Projects <span style={{ fontSize: "0.68rem", color: "#a855f7" }}>(lazy)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/benchmark" className={({ isActive }) => `btn ${isActive ? "btn-secondary" : "btn-icon"}`} style={{ textDecoration: "none", fontSize: "0.85rem", padding: "6px 12px" }}>
              ⚡ Benchmark
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => `btn ${isActive ? "btn-secondary" : "btn-icon"}`} style={{ textDecoration: "none", fontSize: "0.85rem", padding: "6px 12px" }}>
              ℹ️ About
            </NavLink>
          </li>
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isAuthenticated ? (
            <>
              <button type="button" className="btn btn-primary" onClick={onOpenCreate} style={{ padding: "8px 14px", fontSize: "0.85rem" }}>
                <span>+</span> New Task
              </button>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--bg-secondary)",
                padding: "4px 12px 4px 6px",
                borderRadius: "9999px",
                border: "1px solid var(--border-color)"
              }}>
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "white"
                }}>
                  {getInitials(user?.name)}
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)" }}>{user?.name}</span>
              </div>

              <button type="button" className="btn btn-secondary" onClick={logout} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                Logout
              </button>
            </>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onOpenAuth} style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
