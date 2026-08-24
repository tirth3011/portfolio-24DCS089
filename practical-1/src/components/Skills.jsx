function Skills({ skillList }) {
  return (
    <section className="skills-section fade-in">
      <h2 className="section-title">Skills & Expertise</h2>
      <div className="skills-grid">
        {skillList.map((skill, index) => (
          <div key={index} className="skill-card">
            {skill}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
