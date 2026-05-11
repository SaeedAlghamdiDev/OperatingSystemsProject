import { Link, useLocation } from "react-router-dom"
import "./Navbar.css"

export function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        
        <div className="navbar-logo" title="Logo placeholder">
          <img src="src\assets\Logo.png" alt="PMU Logo"></img>
        </div>

        <div className="navbar-logo" title="Logo placeholder">
          <a href="https://github.com/SaeedAlghamdiDev/OperatingSystemsProject"
           target="_blank"
          
           rel="noopener noreferrer"><img src="src\assets\githublogo.png" ></img>
           </a>
          
        </div>

        

        
        <ul className="navbar-links">
          <li className="navbar-link">
            <Link to="/" className={isActive("/") ? "active" : ""}>
              <span>Home</span>
            </Link>
          </li>
          <li className="navbar-link">
            <Link to="/CPUSchedule" className={isActive("/CPUSchedule") ? "active" : ""}>
              <span>CPU</span>
            </Link>
          </li>
          <li className="navbar-link">
            <Link to="/Memory" className={isActive("/Memory") ? "active" : ""}>
              <span>Memory</span>
            </Link>
          </li>
          <li className="navbar-link">
            <Link to="/PageReplacement" className={isActive("/PageReplacement") ? "active" : ""}>
              <span>Pages</span>
            </Link>
          </li>
        </ul>

        <div className="navbar-semester">Spring of 26'</div>
      </div>
    </nav>
  )
}