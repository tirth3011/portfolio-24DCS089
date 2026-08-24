import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page-container" style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "4rem 2rem",
      minHeight: "60vh"
    }}>
      <h1 style={{
        fontSize: "8rem",
        fontWeight: "900",
        background: "linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        lineHeight: 1,
        marginBottom: "1rem"
      }}>404</h1>
      
      <h2 style={{
        fontSize: "2rem",
        marginBottom: "1.5rem",
        fontWeight: "700",
        fontFamily: "var(--font-heading)"
      }}>Page Not Found</h2>
      
      <p style={{
        color: "var(--text-secondary)",
        maxWidth: "500px",
        marginBottom: "2.5rem",
        fontSize: "1.1rem"
      }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
