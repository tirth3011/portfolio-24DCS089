import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-wrapper">
        <NavLink to="/" className="nav-brand">
          <div className="brand-icon">⚡</div>
          <div>
            <span>Practical 8</span>
            <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>
              Lazy Loading & Code Splitting
            </span>
          </div>
        </NavLink>

        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Projects <span style={{ fontSize: "0.68rem", opacity: 0.7 }}>(lazy)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Analytics <span style={{ fontSize: "0.68rem", opacity: 0.7 }}>(heavy)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Contact <span style={{ fontSize: "0.68rem", opacity: 0.7 }}>(lazy)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/benchmark" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Benchmark
            </NavLink>
          </li>
        </ul>

        <div className="nav-badge">
          ● Code Splitting ON
        </div>
      </div>
    </nav>
  );
}
