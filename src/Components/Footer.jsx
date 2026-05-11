import { useLocation } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const location = useLocation();
  
  // Only show footer on task pages, not on home page
  const shouldShowFooter = !["/"].includes(location.pathname);

  if (!shouldShowFooter) {
    return null;
  }

  return (
    <footer className="footer">
  <div className="footer-content">
    <p>OS Simulator</p>
    <p>SOEN 4313-101: Operating Systems</p>
    <p>Prince Mohammad Bin Fahd University - Spring 2026</p>
    <p>Built with React</p>
    <p>Saeed | Naif | Mujahed | Abdullah</p>
    <a href="https://github.com/SaeedAlghamdiDev/OperatingSystemsProject">GitHub Repository</a>
  </div>
</footer>
  );
}

export default Footer;