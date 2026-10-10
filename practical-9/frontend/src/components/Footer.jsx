import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <strong>Practical 8: Performance Optimization & Lazy Loading</strong>
          <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
            ITUE301 — Advanced Web Development Frameworks (AWDF)
          </div>
        </div>

        <div className="footer-author">
          Student: <strong>Tirth Patel</strong> | Roll: <strong>24DCS089</strong> | CSPIT-IT / DEPSTAR
        </div>

        <div>
          <span className="badge badge-emerald">Vite 5 + React 18 Code Splitting</span>
        </div>
      </div>
    </footer>
  );
}
