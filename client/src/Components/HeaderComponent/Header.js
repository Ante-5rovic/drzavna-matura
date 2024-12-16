import React, { useContext } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../_OtherAppRelatedComponents/AuthContext";

const Header = () => {
  const { authState, logout } = useContext(AuthContext);
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

        {authState.token ? ( // Ako je korisnik prijavljen
          <div className="header-registration-wrap">
            <Link to="/user-profil" className="header-link">
              <button
                id="header-button-user-profil"
                className="header-button-design"
              >
                {authState.username}
              </button>
            </Link>
            <h3>|</h3>
            <Link to="/" className="header-link">
              <button
                id="header-button-log-out"
                className="header-button-design"
                onClick={logout}
              >
                Odjava
              </button>
            </Link>
          </div>
        ) : (
          // Ako korisnik NIJE prijavljen
          <div className="header-registration-wrap">
            <Link to="/login" className="header-link">
              <button id="header-button-login" className="header-button-design">
                Prijava
              </button>
            </Link>
            <h3>|</h3>
            <Link to="/register" className="header-link">
              <button
                id="header-button-register"
                className="header-button-design"
              >
                Registracija
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
