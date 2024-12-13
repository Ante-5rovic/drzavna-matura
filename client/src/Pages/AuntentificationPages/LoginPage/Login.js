import React, { useState,useContext  } from "react";

import Navbar from "../../../Components/NavbarComponent/Navbar";
import Header from "../../../Components/HeaderComponent/Header";
import Footer from "../../../Components/FooterComponent/Footer";
import GoogleLoginButton from "./LoginPageComponents/GoogleLoginComponent/GoogleLoginButton";
import useCsrfToken from '../../../Hooks/useCsrfToken';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../Components/_OtherAppRelatedComponents/AuthContext";
import "./login.css";

const Login = () => {
  const csrfToken = useCsrfToken();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useContext(AuthContext);

  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    //console.log("Submitted Data:", formData);
    // Naša interna prijava!
    // Pošalji formData backendu ili izvrši drugu akciju
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          return response.json().then(data => {
            throw new Error(data.error);
          });
        } else {
          throw new Error('Došlo je do greške prilikom prijave.');
        }
      }
      return response.json();
    })
    .then(data => {
      login(data)
      console.log('Uspješna prijava!', data);
      navigate('/');
    })
    .catch(error => {
      console.error('Greška:', error);
      setErrorMsg(error.message); 
    });
  };

  return (
    <div className="log-in-main-wrap">
      <Header />
      <Navbar />
      <section className="log-in-section-wrap">
        <h1 className="log-in-title">Dobrodošli na Maturka</h1>

        <form onSubmit={handleSubmit} id="log-in-form">
          <label
            htmlFor="email"
            className="log-in-form-lable log-in-form-componenet">
            Email:
          </label>
          <input
            type="text"
            id="log-in-email"
            className="log-in-form-componenet log-in-form-input"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label
            htmlFor="password"
            className="log-in-form-lable log-in-form-componenet"
          >
            Lozinka:
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
          <label
            id="log-in-form-error-msg"
            className={`log-in-form-lable log-in-form-componenet log-in-form-error-msg ${
              errorMsg ? "show" : ""
            }`}
          >
            {errorMsg}
          </label>
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
