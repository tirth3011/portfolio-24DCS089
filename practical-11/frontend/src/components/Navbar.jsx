import React from 'react';

export default function Navbar({ containerHost }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand">
          <div className="brand-icon">🐳</div>
          <div>
            <div className="brand-title">TaskGuard</div>
            <div className="brand-sub">DOCKER COMPOSE MULTI-CONTAINER ARCHITECTURE</div>
          </div>
        </div>

        <div className="nav-badges">
          <span className="badge badge-cyan">Host: {containerHost || 'Docker Container'}</span>
        </div>
      </div>
    </header>
  );
}
