import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [estimatedHours, setEstimatedHours] = useState(2);
  const [tags, setTags] = useState(['general']);
  const [aiProvider, setAiProvider] = useState('');
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [suggestionActive, setSuggestionActive] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const res = await apiClient.getTasks();
      if (res.data) setTasks(res.data);
    } catch (err) {
      console.warn("Load tasks failed:", err);
    }
  }

  async function handleGenerateAi() {
    if (!title.trim()) {
      alert("Please enter a task title first!");
      return;
    }

    setLoadingAi(true);
    try {
      const res = await apiClient.suggestAiMetadata(title);
      if (res.success && res.suggestion) {
        setDescription(res.suggestion.description);
        setPriority(res.suggestion.priority);
        setEstimatedHours(res.suggestion.estimatedHours);
        setTags(res.suggestion.tags || ['feature']);
        setAiProvider(res.provider);
        setIsAiGenerated(true);
        setSuggestionActive(true);
      } else {
        alert(res.message || "AI Suggestion unavailable");
      }
    } catch (err) {
      console.error("AI Generation error:", err);
      alert("Failed to call AI service");
    } finally {
      setLoadingAi(false);
    }
  }

  async function handleSaveTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await apiClient.createTask({
        title,
        description,
        priority,
        estimatedHours,
        tags,
        isAiGenerated,
        aiProvider
      });

      // Reset
      setTitle('');
      setDescription('');
      setPriority('medium');
      setEstimatedHours(2);
      setTags(['general']);
      setIsAiGenerated(false);
      setSuggestionActive(false);

      loadTasks();
    } catch (err) {
      console.error("Save task failed:", err);
    }
  }

  return (
    <div className="main-content">
      {/* Responsible AI Disclaimer Banner */}
      <div className="disclaimer-box">
        <span style={{ fontSize: '1.4rem' }}>🛡️</span>
        <div>
          <strong>Responsible AI Governance:</strong> All incoming prompt context is sanitized (PII, tokens, and passwords redacted). AI-generated suggestions must be explicitly verified and reviewed by the engineer before persistence.
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '14px' }}>✨ AI-Assisted Task Creation</h3>
        <form onSubmit={handleSaveTask}>
          <div className="form-group">
            <label>Task Title:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Implement Docker Compose & Container Orchestration..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={handleGenerateAi}
                className="btn btn-ai"
                disabled={loadingAi}
              >
                {loadingAi ? '⏳ Synthesizing...' : '✨ Auto-Generate with AI'}
              </button>
            </div>
          </div>

          {suggestionActive && (
            <div className="suggestion-drawer">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#c084fc', fontWeight: 600, fontSize: '0.85rem' }}>
                  🤖 Suggested by: {aiProvider}
                </span>
                <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
                  Review & Edit Before Saving
                </span>
              </div>

              <div className="form-group">
                <label>Description (Editable):</label>
                <textarea
                  className="input-field"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label>Suggested Priority:</label>
                  <select
                    className="input-field"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label>Estimated Duration (Hours):</label>
                  <input
                    type="number"
                    className="input-field"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(parseInt(e.target.value, 10) || 1)}
                    min={1}
                    max={40}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                {tags.map(t => (
                  <span key={t} className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                    #{t}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-save" style={{ flex: 1 }}>
                  ✔ Accept & Save Task
                </button>
                <button
                  type="button"
                  onClick={() => setSuggestionActive(false)}
                  className="btn"
                  style={{ background: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8' }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Task List */}
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>📋 Verified Task Registry ({tasks.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tasks.map(t => (
            <div key={t._id} style={{
              background: 'rgba(7, 9, 14, 0.7)',
              border: '1px solid rgba(148, 163, 184, 0.12)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t.title}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {t.isAiGenerated && (
                    <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>
                      ✨ AI Generated
                    </span>
                  )}
                  <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                    {t.priority.toUpperCase()}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>{t.description}</div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.75rem', color: '#64748b' }}>
                <span>⏱ {t.estimatedHours || 2}h</span>
                <span>🏷 {(t.tags || []).join(', ')}</span>
                <span>👤 {t.assignedUser}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
