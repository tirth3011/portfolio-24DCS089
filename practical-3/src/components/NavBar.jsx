import { NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar({ theme, toggleTheme }) {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          Tirth<span className="logo-dot">.</span>
        </NavLink>
        
        <nav className="navbar-links">
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Home
          </NavLink>
          <NavLink 
            to="/projects" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Projects
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Contact
          </NavLink>
        </nav>
        
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn" 
          aria-label="Toggle Theme"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          <span className="theme-toggle-icon">
            {theme === "light" ? "🌙" : "☀️"}
          </span>
        </button>
      </div>
    </header>
  );
}

export default NavBar;