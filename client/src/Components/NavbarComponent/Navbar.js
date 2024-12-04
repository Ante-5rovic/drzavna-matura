import React from "react";
import './navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar-main-wrap">
      <div className="navbar-subjects-pc-wrap">
        <h2 className="navbar-subject">Matematika viša</h2>
        <h2 className="navbar-subject">Matematika niža</h2>
        <h2 className="navbar-subject">Hrvatski viša</h2>
        <h2 className="navbar-subject">Hrvatski niža</h2>
        <h2 className="navbar-subject">Engleski viša</h2>
        <h2 className="navbar-subject">Engleski niža</h2>
      </div>
      <div className="navbar-subjects-phone-wrap">
        <h2 className="navbar-subject">Mat viša</h2>
        <h2 className="navbar-subject">Mat niža</h2>
        <h2 className="navbar-subject">Hrv viša</h2>
        <h2 className="navbar-subject">Hrv niža</h2>
        <h2 className="navbar-subject">Eng viša</h2>
        <h2 className="navbar-subject">Eng niža</h2>
      </div>
    </nav>
  );
};

export default Navbar;
