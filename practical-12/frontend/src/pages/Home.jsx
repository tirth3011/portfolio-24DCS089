import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';

export default function Home() {
  const [ciStatus, setCiStatus] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 4000);
    return () => clearInterval(timer);
  }, []);

  async function loadData() {
    try {
      const [statusRes, tasksRes] = await Promise.all([
        apiClient.getCiStatus(),
        apiClient.getTasks()
      ]);
      if (statusRes.pipeline) setCiStatus(statusRes.pipeline);
      if (tasksRes.data) setTasks(tasksRes.data);
    } catch (err) {
      console.warn("Poll failed:", err);
    }
  }

  async function handleToggleFail() {
    setLoading(true);
    try {
      const res = await apiClient.toggleFailMode();
      if (res.pipeline) setCiStatus(res.pipeline);
    } catch (err) {
      console.error("Toggle failed:", err);
    } finally {
      setLoading(false);
    }
  }

  const isSuccess = ciStatus?.status === 'success';

  return (
    <div className="main-content">
      {/* CI Status Header Card */}
      <div className="card">
        <div className="status-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              background: isSuccess ? 'rgba(35, 134, 54, 0.2)' : 'rgba(218, 54, 51, 0.2)',
              color: isSuccess ? '#3fb950' : '#f85149',
              border: `2px solid ${isSuccess ? '#3fb950' : '#f85149'}`
            }}>
              {isSuccess ? '✔' : '✖'}
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                Workflow: CI Pipeline ({isSuccess ? 'Passing' : 'Failed'})
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Commit: {ciStatus?.commitSha || '0fbc4ea'} • Trigger: push on main • Tests: {ciStatus?.passedTests || 5}/{ciStatus?.totalTests || 5}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{
              background: isSuccess ? '#238636' : '#da3633',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '999px'
            }}>
              {isSuccess ? 'passing' : 'failing'}
            </span>

            <button
              onClick={handleToggleFail}
              className={`btn ${isSuccess ? 'btn-toggle' : 'btn-fix'}`}
              disabled={loading}
            >
              {loading ? 'Processing...' : (isSuccess ? '⚠️ Demonstrate Broken Test' : '✔ Fix & Pass Pipeline')}
            </button>
          </div>
        </div>

        {/* 5-Step Pipeline Grid */}
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
          GitHub Actions Workflow Stages:
        </div>
        <div className="pipeline-diagram">
          <div className="step-card success">
            <div style={{ color: '#3fb950', fontSize: '1.1rem' }}>✔</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '4px' }}>Checkout</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>actions/checkout@v4</div>
          </div>

          <div className="step-card success">
            <div style={{ color: '#3fb950', fontSize: '1.1rem' }}>✔</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '4px' }}>Setup Node</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>v18.x Alpine</div>
          </div>

          <div className="step-card success">
            <div style={{ color: '#3fb950', fontSize: '1.1rem' }}>✔</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '4px' }}>Install</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>npm install</div>
          </div>

          <div className="step-card success">
            <div style={{ color: '#3fb950', fontSize: '1.1rem' }}>✔</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '4px' }}>ESLint</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Code Quality</div>
          </div>

          <div className={`step-card ${isSuccess ? 'success' : 'fail'}`}>
            <div style={{ color: isSuccess ? '#3fb950' : '#f85149', fontSize: '1.1rem' }}>
              {isSuccess ? '✔' : '✖'}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '4px' }}>npm test</div>
            <div style={{ fontSize: '0.7rem', color: isSuccess ? '#3fb950' : '#f85149' }}>
              {isSuccess ? '5/5 Passed' : '1 Failed (Exit 1)'}
            </div>
          </div>
        </div>

        {/* Runner Logs Console */}
        <pre className="runner-terminal" style={{ color: isSuccess ? '#7ee787' : '#f85149' }}>
          {ciStatus?.logs?.join('\n') || 'Initializing runner...'}
        </pre>
      </div>

      {/* Task Summary Card */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>📋 Verified Endpoints & Application Tasks</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tasks.map(t => (
            <div key={t._id} style={{
              background: 'rgba(7, 9, 14, 0.6)',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.description}</div>
              </div>
              <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                {t.priority.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
