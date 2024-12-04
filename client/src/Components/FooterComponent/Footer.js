import React from "react";

import "./footer.css";
import Quotes from "./QuotesComponent/Quotes";

const Footer = () => {
  return (
    <footer className="footer-main-wrap">
      <div id="footer-separation-immage"></div>
      <section className="footer-section-wrap">
        <div className="footer-section-left-side-wrap">
          <div className="footer-logo-title-wrap">
            <img id="footer-logo-img" src="/Images/Logo/logo2.png" alt="logo" />
            <div className="footer-title-wrap">
              <h1 className="footer-title">MATURKO</h1>
              <h2 className="footer-subtitle">Vježbaj maturu online</h2>
            </div>
          </div>
          <div className="footer-base-information-wrap">
            <h3 className="footer-base-information">Kako koristiti Maturka</h3>
            <h3 className="footer-base-information">Izborni predmeti</h3>
            <h3 className="footer-base-information">O nama</h3>
          </div>
        </div>
        <div className="footer-section-separator"></div>
        <div className="footer-section-right-side-wrap">
          <div className="footer-contact-information-wrap">
            <h3 className="footer-contact-information-title">Kontaktiraj nas
            </h3>
            <address className="footer-contact-information-adresss-wrap">
              <p>
                <strong className="footer-base-information-title">Email:  </strong>
                <a className="footer-base-information footer-base-information-information" href="mailto:example@example.com">example@example.com</a>
              </p>
              <p>
                <strong className="footer-base-information-title">Broj telefona:  </strong>
                <a className="footer-base-information  footer-base-information-information" href="tel:+1234567890">+123 456 7890</a>
              </p>
            </address>
            <div className="footer-social-media-wrap">
              <img
                className="footer-social-media-icon"
                src="Images\Footer\Social media\icons8-facebook.svg"
                alt="facebook link"
              />
              <img
                className="footer-social-media-icon"
                src="Images\Footer\Social media\icons8-instagram.svg"
                alt="instagarm link"
              />
              <img
                className="footer-social-media-icon"
                src="Images\Footer\Social media\icons8-linkedin.svg"
                alt="linkedin link"
              />
            </div>
          </div>
          <div className="footer-quote-wrap">
            <Quotes/>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
