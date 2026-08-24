import { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const maxChars = 200;

  const handleMessageChange = (e) => {
    const val = e.target.value;
    if (val.length <= maxChars) {
      setMessage(val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }
    // Simple simulation of form submission success
    setSubmitted(true);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setMessage("");
    setSubmitted(false);
  };

  return (
    <div className="page-container fade-in" style={{ maxWidth: "600px" }}>
      <h1 className="section-title">Contact Me</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: "1.1rem", marginBottom: "2rem" }}>
        Get in touch with me or send a quick message in real-time.
      </p>

      {submitted ? (
        <div className="contact-card success-screen fade-in">
          <div className="success-icon">✓</div>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem", fontWeight: "700" }}>Message Sent!</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
            Thank you, <strong>{name}</strong>. Your message has been sent successfully. I will get back to you soon.
          </p>
          <button className="btn btn-primary" onClick={resetForm}>
            Send Another Message
          </button>
        </div>
      ) : (
        <form className="contact-card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea
              id="message"
              className="form-textarea"
              placeholder="Type your message here..."
              value={message}
              onChange={handleMessageChange}
              required
            />
            <div className={`char-count ${message.length >= maxChars ? "danger" : ""}`}>
              {message.length} / {maxChars} characters
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Send Message
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Contact;