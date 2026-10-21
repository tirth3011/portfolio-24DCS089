import React from 'react';

export default function DockerBanner({ status }) {
  const container = status?.container || {};
  const orchestration = status?.orchestration || {};

  return (
    <div className="docker-banner">
      <div className="banner-header">
        <div className="banner-title">
          <span>🚢 Docker Compose Service Topology</span>
          <span className="badge badge-cyan">{orchestration.network || 'app-network'}</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
          ● Stack Status: Online
        </div>
      </div>

      <div className="topology-grid">
        <div className="node-box active">
          <div className="node-icon">⚛️</div>
          <div className="node-label">React Frontend</div>
          <div className="node-meta">Port 5178 ➔ 5173</div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Multi-Stage Alpine</div>
        </div>

        <div className="arrow-icon">➔</div>

        <div className="node-box active">
          <div className="node-icon">⚡</div>
          <div className="node-label">Express Backend</div>
          <div className="node-meta">Port 5011 ➔ 5011</div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>DNS: backend</div>
        </div>

        <div className="arrow-icon">➔</div>

        <div className="node-box active">
          <div className="node-icon">🍃</div>
          <div className="node-label">MongoDB 6.0</div>
          <div className="node-meta">Port 27017 ➔ 27017</div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Vol: mongo-data</div>
        </div>
      </div>
    </div>
  );
}
