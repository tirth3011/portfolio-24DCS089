import { useState, useEffect } from "react";

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [simulateError, setSimulateError] = useState(false);

  const fetchRepos = () => {
    setLoading(true);
    setError(null);
    
    // If simulateError is true, we call a broken URL to trigger the catch block.
    const url = simulateError 
      ? "https://api.github.com/users/tirth3011/broken_url_for_testing"
      : "https://api.github.com/users/tirth3011/repos";

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        // Sort repos by stars descending
        const sorted = data.sort((a, b) => b.stargazers_count - a.stargazers_count);
        setRepos(sorted);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRepos();
  }, [simulateError]);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", marginBottom: "1.5rem" }}>
        <div>
          <h1 className="section-title">My Projects</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: "1.1rem" }}>
            Dynamically loaded from my GitHub profile.
          </p>
        </div>

        {/* Demo Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button 
            onClick={() => setSimulateError(!simulateError)} 
            className="btn btn-secondary"
            style={{ 
              borderColor: simulateError ? "var(--danger-color)" : "var(--border-color)", 
              color: simulateError ? "var(--danger-color)" : "var(--text-primary)",
              padding: "0.5rem 1rem",
              fontSize: "0.85rem"
            }}
          >
            {simulateError ? "⚡ Use Real API" : "⚠️ Simulate API Failure"}
          </button>
        </div>
      </div>

      {/* Search Input */}
      {!error && !loading && (
        <div style={{ marginBottom: "2rem" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search projects by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: "400px" }}
          />
        </div>
      )}

      {/* Conditional Rendering */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
          <div className="spinner" style={{
            width: "50px",
            height: "50px",
            border: "5px solid var(--border-color)",
            borderTop: "5px solid var(--primary-color)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ marginTop: "1.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>
            Fetching from GitHub...
          </p>
        </div>
      ) : error ? (
        <div className="contact-card" style={{ textAlign: "center", padding: "3rem", margin: "2rem auto", maxWidth: "500px" }}>
          <div style={{ fontSize: "3.5rem", color: "var(--danger-color)", marginBottom: "1rem" }}>⚠️</div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem", fontWeight: 700 }}>Failed to Load Projects</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>{error}</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button className="btn btn-primary" onClick={fetchRepos}>Retry Request</button>
            {simulateError && (
              <button className="btn btn-secondary" onClick={() => setSimulateError(false)}>Disable Simulation</button>
            )}
          </div>
        </div>
      ) : (
        <>
          {filteredRepos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
              <h3>No projects found matching "{searchQuery}"</h3>
            </div>
          ) : (
            <div className="grid-layout">
              {filteredRepos.map((repo) => (
                <div key={repo.id} className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--text-primary)" }}>
                      {repo.name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.85rem", color: "var(--accent-color)", fontWeight: 600 }}>
                      ⭐ {repo.stargazers_count}
                    </div>
                  </div>
                  
                  <p style={{
                    fontSize: "0.95rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    marginBottom: "1.5rem",
                    flexGrow: 1
                  }}>
                    {repo.description || "No description provided."}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1.5rem" }}>
                    {repo.language && (
                      <span style={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        backgroundColor: "var(--badge-bg)",
                        color: "var(--badge-text)"
                      }}>
                        {repo.language}
                      </span>
                    )}
                  </div>

                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{
                    width: "100%",
                    textAlign: "center"
                  }}>
                    View Project
                  </a>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Projects;