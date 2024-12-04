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
        <h2 className="navbar-subject">Mat A</h2>
        <h2 className="navbar-subject">Mat B</h2>
        <h2 className="navbar-subject">Hrv A</h2>
        <h2 className="navbar-subject">Hrv B</h2>
        <h2 className="navbar-subject">Eng A</h2>
        <h2 className="navbar-subject">Eng B</h2>
      </div>
    </nav>
  );
};

export default Navbar;
