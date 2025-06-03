import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar-main-wrap">
      <div className="navbar-subjects-pc-wrap">
        <Link to="/matura/hrvatski" className="navbar-subject-link">
          <h2 className="navbar-subject">Hrvatski</h2>
        </Link>
        <Link to="/matura/matematika/visa" className="navbar-subject-link">
          <h2 className="navbar-subject">Matematika viša</h2>
        </Link>
        <Link to="/matura/matematika/niza" className="navbar-subject-link">
          <h2 className="navbar-subject">Matematika niža</h2>
        </Link>
        <Link to="/matura/engleski/visa" className="navbar-subject-link">
          <h2 className="navbar-subject">Engleski viša</h2>
        </Link>
        <Link to="/matura/engleski/niza" className="navbar-subject-link">
          <h2 className="navbar-subject">Engleski niža</h2>
        </Link>
        <Link to="/admin" className="navbar-subject-link admin-link">
          <h2 className="navbar-subject">Admin panel</h2>
        </Link>
      </div>
      <div className="navbar-subjects-phone-wrap">
        <Link to="/matura/hrvatski" className="navbar-subject-link">
          <h2 className="navbar-subject">Hrv A</h2>
        </Link>
        <Link to="/matura/hrvatski/niza" className="navbar-subject-link">
          <h2 className="navbar-subject">Hrv B</h2>
        </Link>
        <Link to="/matura/matematika/visa" className="navbar-subject-link">
          <h2 className="navbar-subject">Mat A</h2>
        </Link>
        <Link to="/matura/matematika/niza" className="navbar-subject-link">
          <h2 className="navbar-subject">Mat B</h2>
        </Link>
        <Link to="/matura/engleski/visa" className="navbar-subject-link">
          <h2 className="navbar-subject">Eng A</h2>
        </Link>
        <Link to="/matura/engleski/niza" className="navbar-subject-link">
          <h2 className="navbar-subject">Eng B</h2>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
