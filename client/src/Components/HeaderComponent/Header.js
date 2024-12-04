import React from "react";
import "./header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header-main-wrap">
      <div className="header-content-wrap">
        <div className="header-title-logo-wrap">
          <Link to="/" className="header-link">
            <img id="header-logo-img" src="/Images/Logo/logo2.png" alt="logo" />
          </Link>
          <div className="header-title-wrap">
            <Link to="/" className="header-link">
              <h1 className="header-title">MATURKO</h1>
            </Link>
            <h2 className="header-subtitle">Vježbaj maturu online</h2>
          </div>
        </div>
        <div className="header-registration-wrap">
          <Link to="/" className="header-link">
            <button id="header-button-login" className="header-button-design">
              Prijava
            </button>
          </Link>
          <h3>|</h3>
          <Link to="/" className="header-link">
            <button id="header-button-registe" className="header-button-design">
              Registracija
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
