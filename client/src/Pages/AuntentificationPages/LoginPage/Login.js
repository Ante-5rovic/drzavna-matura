import React, { useState } from "react";

import Navbar from "../../../Components/NavbarComponent/Navbar";
import Header from "../../../Components/HeaderComponent/Header";
import Footer from "../../../Components/FooterComponent/Footer";
import GoogleLoginButton from "./LoginPageComponents/GoogleLoginComponent/GoogleLoginButton";

import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // Naša interna prijava!
    // Pošalji formData backendu ili izvrši drugu akciju
  };

  return (
    <div className="log-in-main-wrap">
      <Header />
      <Navbar />
      <section className="log-in-section-wrap">
        <h1 className="log-in-title">Dobrodošli na Maturka</h1>
        <form onSubmit={handleSubmit} id="log-in-form">
          <label
            htmlFor="username"
            className="log-in-form-lable log-in-form-componenet"
          >
            Korisničko ime / email
          </label>
          <input
            type="text"
            id="log-in-username"
            className="log-in-form-componenet log-in-form-input"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label
            htmlFor="password"
            className="log-in-form-lable log-in-form-componenet"
          >
            Lozinka
          </label>
          <input
            type="password"
            id="log-in-password"
            className="log-in-form-componenet log-in-form-input"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="log-in-form-button-wrap">
            <button
              type="submit"
              id="log-in-form-button"
              className="log-in-form-componenet"
            >
              Prijavi se
            </button>
          </div>
        </form>
        <h1 className="log-in-form-componenet log-in-text-separator">ili</h1>
        <div className="log-in-google-button-wrap log-in-form-componenet">
          <GoogleLoginButton />
        </div>
      </section>
      <Footer footerImmageClass={"footer2"} />
    </div>
  );
};

export default Login;
