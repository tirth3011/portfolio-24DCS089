import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
      <h1 className="page-title" style={{ fontSize: "2.5rem" }}>404 - Page Not Found</h1>
      <p className="page-subtitle" style={{ maxWidth: "500px", margin: "1rem auto 2rem" }}>
        The route you are trying to access does not exist or has been code-split into another universe.
      </p>
      <Link to="/" className="btn btn-primary">
        ← Return to Overview
      </Link>
    </div>
  );
}
