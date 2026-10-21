import React from 'react';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand">
          <div className="brand-icon">✨</div>
          <div>
            <div className="brand-title">TaskGuard</div>
            <div className="brand-sub">AI API INTEGRATION & RESPONSIBLE AI GOVERNANCE</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span className="badge badge-ai">Model: Gemini 1.5 Flash / Safe Fallback</span>
        </div>
      </div>
    </header>
  );
}
