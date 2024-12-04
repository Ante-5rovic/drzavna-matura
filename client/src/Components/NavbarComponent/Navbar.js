import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar-main-wrap">
      <div className="navbar-subjects-pc-wrap">
        <Link to="/StillInDevelopment" className="navbar-subject-link">
          <h2 className="navbar-subject">Matematika viša</h2>
        </Link>
        <Link to="/StillInDevelopment" className="navbar-subject-link">
          <h2 className="navbar-subject">Matematika niža</h2>
        </Link>
        <Link to="/StillInDevelopment" className="navbar-subject-link">
          <h2 className="navbar-subject">Hrvatski viša</h2>
        </Link>
        <Link to="/StillInDevelopment" className="navbar-subject-link">
          <h2 className="navbar-subject">Hrvatski niža</h2>
        </Link>
        <Link to="/StillInDevelopment" className="navbar-subject-link">
          <h2 className="navbar-subject">Engleski viša</h2>
        </Link>
        <Link to="/StillInDevelopment" className="navbar-subject-link">
          <h2 className="navbar-subject">Engleski niža</h2>
        </Link>
      </div>
      <div className="navbar-subjects-phone-wrap">
        <Link to="/StillInDevelopment" className="navbar-subject-link">
          <h2 className="navbar-subject">Mat A</h2>
        </Link>
        <Link to="/StillInDevelopment" className="navbar-subject-link">
          <h2 className="navbar-subject">Mat B</h2>
        </Link>
        <Link to="/StillInDevelopment" className="navbar-subject-link">
          <h2 className="navbar-subject">Hrv A</h2>
        </Link>
        <Link to="/StillInDevelopment" className="navbar-subject-link">
          <h2 className="navbar-subject">Hrv B</h2>
        </Link>
        <Link to="/StillInDevelopment" className="navbar-subject-link">
          <h2 className="navbar-subject">Eng A</h2>
        </Link>
        <Link to="/StillInDevelopment" className="navbar-subject-link">
          <h2 className="navbar-subject">Eng B</h2>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
