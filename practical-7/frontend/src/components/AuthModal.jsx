import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegister && (!name || name.trim().length < 2)) {
      setError("Please enter a valid full name (at least 2 characters).");
      return;
    }

    if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      if (isRegister) {
        await register(name.trim(), email.trim(), password);
        onSuccess("Account registered and logged in successfully!");
      } else {
        await login(email.trim(), password);
        onSuccess("Welcome back! Logged in successfully.");
      }
      onClose();
    } catch (err) {
      const serverErr = err.response?.data?.error || err.response?.data?.errors?.[0] || "Authentication failed. Please check your credentials.";
      setError(serverErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "16px", marginBottom: "20px" }}>
          <button
            type="button"
            className="btn"
            style={{
              flex: 1,
              background: !isRegister ? "var(--bg-card-hover)" : "transparent",
              color: !isRegister ? "var(--text-primary)" : "var(--text-muted)",
              border: !isRegister ? "1px solid var(--border-focus)" : "1px solid transparent"
            }}
            onClick={() => {
              setIsRegister(false);
              setError("");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className="btn"
            style={{
              flex: 1,
              background: isRegister ? "var(--bg-card-hover)" : "transparent",
              color: isRegister ? "var(--text-primary)" : "var(--text-muted)",
              border: isRegister ? "1px solid var(--border-focus)" : "1px solid transparent"
            }}
            onClick={() => {
              setIsRegister(true);
              setError("");
            }}
          >
            Create Account
          </button>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            {isRegister ? "Create your account" : "Sign in to TaskGuard"}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            {isRegister
              ? "All tasks are securely encrypted and tied to your user identity."
              : "Enter your email and password to access your protected tasks."}
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            color: "#f87171",
            fontSize: "0.85rem",
            marginBottom: "16px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Full Name
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Tirth Patel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Email Address
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="tirth@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Password (min 6 characters)
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px" }}
            disabled={loading}
          >
            {loading ? "Verifying..." : isRegister ? "Register & Sign In" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};
