import React from "react";
import { useAuth } from "../context/AuthContext";

export const Navbar = ({ onOpenAuth, onOpenCreate }) => {
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
    <nav className="glass-panel" style={{ padding: "16px 24px", marginBottom: "28px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "var(--radius-md)",
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)"
          }}>
            🛡️
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h1 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                TaskGuard
              </h1>
              <span style={{
                fontSize: "0.7rem",
                fontFamily: "var(--font-mono)",
                background: "rgba(99, 102, 241, 0.15)",
                color: "#818cf8",
                padding: "2px 6px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid rgba(99, 102, 241, 0.3)"
              }}>
                JWT Auth • Practical 7
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Protected Task Pipeline • Express Middleware • Bcrypt
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isAuthenticated ? (
            <>
              <button type="button" className="btn btn-primary" onClick={onOpenCreate}>
                <span>+</span> New Task
              </button>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "var(--bg-primary)",
                padding: "6px 14px 6px 8px",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border)"
              }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "white"
                }}>
                  {getInitials(user?.name)}
                </div>
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.2 }}>{user?.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1 }}>{user?.email}</p>
                </div>
              </div>

              <button type="button" className="btn btn-secondary" onClick={logout} title="Sign Out">
                Logout
              </button>
            </>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onOpenAuth}>
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
