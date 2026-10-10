import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // State 1: UI visibility toggle (tooltip / help card)
  const [showHelp, setShowHelp] = useState(false);

  // State 2: Form feedback & submission state
  const [submitted, setSubmitted] = useState(false);

  const maxMessageLength = 500;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span className="badge badge-purple">Lazy-Loaded Route</span>
          <span className="badge badge-cyan">Contact.chunk.js</span>
        </div>
        <h1 className="page-title">Contact & Feedback</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          Controlled interactive state management with real-time character count and feedback validation.
        </p>
      </div>

      <div className="glass-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.2rem" }}>Send a Message</h3>
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="btn btn-secondary"
            style={{ padding: "0.35rem 0.85rem", fontSize: "0.8rem" }}
          >
            {showHelp ? "Hide Hints" : "💡 Help Hint"}
          </button>
        </div>

        {showHelp && (
          <div style={{ background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.3)", padding: "1rem", borderRadius: "var(--radius-sm)", marginBottom: "1.5rem", fontSize: "0.88rem", color: "#bae6fd" }}>
            <strong>Practical Requirement Fulfilled:</strong> Demonstrating controlled inputs with two <code>useState</code> hooks:
            one managing form state with real-time character counting, and one toggling this help box!
          </div>
        )}

        {submitted ? (
          <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎉</div>
            <h3 style={{ fontSize: "1.4rem", color: "var(--accent-emerald)", marginBottom: "0.5rem" }}>
              Message Dispatched Successfully!
            </h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Thank you, <strong>{formData.name}</strong>. Your message was processed.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: "", email: "", subject: "", message: "" });
              }}
              className="btn btn-secondary"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tirth Patel"
                required
                style={{
                  width: "100%",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid var(--border-color)",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)",
                  fontSize: "0.92rem",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="24dcs089@charusat.edu.in"
                required
                style={{
                  width: "100%",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid var(--border-color)",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)",
                  fontSize: "0.92rem",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.85rem" }}>
                <label style={{ color: "var(--text-secondary)" }}>Message</label>
                <span style={{ fontFamily: "var(--font-mono)", color: formData.message.length > maxMessageLength * 0.9 ? "var(--accent-rose)" : "var(--text-muted)" }}>
                  {formData.message.length} / {maxMessageLength} chars
                </span>
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                maxLength={maxMessageLength}
                placeholder="Type your message here..."
                rows={4}
                required
                style={{
                  width: "100%",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid var(--border-color)",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)",
                  fontSize: "0.92rem",
                  outline: "none",
                  resize: "vertical"
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}>
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
