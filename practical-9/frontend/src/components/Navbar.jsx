import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCacheStats, clearCache } from "../api/apiClient";

export default function Navbar({ onOpenAuth, onOpenCreate }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0, hitRate: "0.00%" });

  const loadStats = async () => {
    try {
      const res = await getCacheStats();
      if (res && res.stats) {
        setCacheStats({
          hits: res.stats.hits || 0,
          misses: res.stats.misses || 0,
          hitRate: res.stats.hitRate || "0.00%"
        });
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    const handleTelemetry = () => loadStats();
    window.addEventListener("cache:telemetry", handleTelemetry);
    return () => {
      clearInterval(interval);
      window.removeEventListener("cache:telemetry", handleTelemetry);
    };
  }, []);

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
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)"
          }}>
            ⚡
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)" }}>TaskGuard</span>
              <span style={{
                fontSize: "0.68rem",
                fontFamily: "var(--font-mono)",
                background: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                padding: "2px 6px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid rgba(16, 185, 129, 0.3)"
              }}>
                P9 • In-Memory Cache
              </span>
            </div>
            <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>
              node-cache (RAM) • 60s TTL • Write-Purge
            </span>
          </div>
        </NavLink>

        <ul className="nav-links" style={{ listStyle: "none", display: "flex", gap: "8px", margin: 0, padding: 0, alignItems: "center" }}>
          <li>
            <NavLink to="/" end className={({ isActive }) => `btn ${isActive ? "btn-secondary" : "btn-icon"}`} style={{ textDecoration: "none", fontSize: "0.85rem", padding: "6px 12px" }}>
              📋 Tasks &amp; Cache
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
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            padding: "4px 10px",
            borderRadius: "var(--radius-sm)",
            color: "#34d399",
            display: "flex",
            gap: "8px"
          }}>
            <span>Hits: <strong>{cacheStats.hits}</strong></span>
            <span>Misses: <strong>{cacheStats.misses}</strong></span>
            <span>Ratio: <strong>{cacheStats.hitRate}</strong></span>
          </div>

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
