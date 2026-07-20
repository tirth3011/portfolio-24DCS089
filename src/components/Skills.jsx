function Skills({ skills }) {
  return (
    <section className="skills-section">
      <h2 className="section-title">Skills</h2>
      <ul className="skills-list">
        {skills.map((skill, index) => (
          <li key={index} className="skills-list-item">
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;
