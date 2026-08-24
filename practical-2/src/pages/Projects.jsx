function Projects() {
  const projectList = [
    {
      title: "HealthTech PHI/PII Redaction Pipeline",
      description: "An automated pipeline built for redacting Protected Health Information (PHI) and Personally Identifiable Information (PII) to secure sensitive healthcare data before processing with Large Language Models (LLMs).",
      tags: ["Python", "LLMs", "Redaction", "Data Security"],
      link: "https://github.com/Mantra-17/HealthTech_Automated-PHI-PII-Redaction-Pipeline-for-LLMs.git"
    },
    {
      title: "Vats & Brinda Wedding Website",
      description: "An elegant, interactive wedding invitation website featuring a custom photo gallery, RSVPs, dynamic event information, and tailored styling to celebrate the couple.",
      tags: ["React", "Vite", "Frontend", "Creative Dev"],
      link: "https://github.com/tirth3011/Vats-Brinds-Wedding.git"
    },
    {
      title: "SOARVault",
      description: "A secure vault and management platform designed for orchestrating, automating, and response playbook architectures to streamline security operations workflow execution.",
      tags: ["SOAR", "Security Ops", "Automation", "Python"],
      link: "https://github.com/Mantra-17/SOARVault"
    }
  ];

  return (
    <div className="page-container fade-in">
      <h1 className="section-title">My Projects</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: "1.1rem" }}>
        A selection of academic and personal engineering projects I've built.
      </p>

      <div className="grid-layout">
        {projectList.map((project, idx) => (
          <div key={idx} className="card">
            <h3 style={{
              fontSize: "1.4rem",
              fontWeight: "700",
              color: "var(--text-primary)",
              marginBottom: "0.75rem"
            }}>
              {project.title}
            </h3>
            
            <p style={{
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              marginBottom: "1.5rem",
              flexGrow: 1
            }}>
              {project.description}
            </p>

            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "1.5rem"
            }}>
              {project.tags.map((tag, tagIdx) => (
                <span key={tagIdx} style={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  backgroundColor: "var(--badge-bg)",
                  color: "var(--badge-text)"
                }}>
                  {tag}
                </span>
              ))}
            </div>

            <a href={project.link} className="btn btn-secondary" style={{
              width: "100%",
              textAlign: "center"
            }}>
              View Project
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;