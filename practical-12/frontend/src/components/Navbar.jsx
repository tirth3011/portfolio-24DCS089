import React from 'react';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand">
          <div className="brand-icon">🐙</div>
          <div>
            <div className="brand-title">TaskGuard</div>
            <div className="brand-sub">GITHUB ACTIONS CONTINUOUS INTEGRATION & TESTING</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>Branch: main</span>
        </div>
      </div>
    </header>
  );
}
