import React, { useState } from "react";

import Navbar from "../../../Components/NavbarComponent/Navbar";
import Header from "../../../Components/HeaderComponent/Header";
import Footer from "../../../Components/FooterComponent/Footer";
import GoogleLoginButton from "../LoginPage/LoginPageComponents/GoogleLoginComponent/GoogleLoginButton";
import useCsrfToken from '../../../Hooks/useCsrfToken';

import "./register.css";

const Register = () => {
  const csrfToken = useCsrfToken();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Naša interna registracija!
    // Pošalji formData backendu ili izvrši drugu akciju

    // Treba provjeriti i na backendu, ali i ovdje cu prije slanja provjeriti
    // jesu li zadovoljeni neki osnovni uvjti da se smanji opterecenje na backend

    // Dodatno napraviti ljepsi error msg, nebitno za sada

    if (formData.username === "") {
      // Prvo provjeri jeli unesen username
      setErrorMsg("Korisničko ime ne smije biti prazno.");
      changeBorderError("username")
    } else if (formData.email === "") {
      // Provjeri jeli unesen email
      setErrorMsg("Korisničko ime ne smije biti prazno.");
      changeBorderError("email")
    } else if (formData.password === "") {
      // Provjeri jeli unesen password
      setErrorMsg("Lozinka ne smije biti prazna.");
      changeBorderError("password")
    } else if (formData.passwordRepeat === "") {
      // Provjeri jeli unesen passwordRepeat
      setErrorMsg("Ponovljena lozinka ne smije biti prazna.");
      changeBorderError("passwordRepeat")
    } else {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      if (!isValid) {
        // Provjeri jeli mail u standardnom obliku
        setErrorMsg(
          "Email mora biti u ispravnom formatu. Npr: primjer@gmail.com"
        );
        changeBorderError("email")
      } else if (formData.password.length < 8) {
        // Provjeri duzinu lozinke
        setErrorMsg("Lozinka mora imati barem 8 znakova.");
        changeBorderError("password")
      } else if (!/[A-Z]/.test(formData.password)) {
        // Provjeri sadrzi li lozinka barme jedno veliko slovo
        setErrorMsg("Lozinka mora imati barem jedno veliko slovo.");
        changeBorderError("password")
      } else if (!/[0-9]/.test(formData.password)) {
        // Provjeri sadrzi li lozinka barem jedan broj
        setErrorMsg("Lozinka mora imati barem jedan broj.");
        changeBorderError("password")
      } else if (!/[^a-zA-Z0-9]/.test(formData.password)) {
        // Provjeri sadrzava li lozinka barem jedan specijalni znak
        setErrorMsg(
          `Lozinka mora imati barem jedan specijalni znak.Npr: !@#$%^&*(),.?":{}|<>`
        );
        changeBorderError("password")
      } else if (formData.password !== formData.passwordRepeat) {
        // Provjeri jesu li lozinke jednake
        setErrorMsg("Lozinka i ponovljena lozinka nisu jednake.");
        changeBorderError("passwordRepeat")
      } else {
        // Salji na backend <---- TO DO
        setErrorMsg("");
        console.log("Submitted Data:", formData);
        
        fetch('/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': csrfToken
          },
          body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                if (response.status >= 400) {
                    return response.json().then(data => {
                        throw new Error(data.error);
                    });
                } else {
                    throw new Error('Došlo je do greške prilikom registracije.');
                }
            }
            return response.json();
        })
        .then(data => {
            console.log('Uspješna registracija!', data);
            setFormData({
                username: '',
                email: '',
                password: '',
                passwordRepeat: ''
            });
        })
        .catch(error => {
            console.error('Greška:', error);
            setErrorMsg(error.message);
        });
      }
    }
  };

  const changeBorderError = (elementId) => {
    const element = document.getElementById("register-"+elementId);
    if (element) {
      element.style.borderBottom = "2px solid red";
    }
  };
  const changeBorderOnFocus = (elementId) => {
    const element = document.getElementById("register-"+elementId);
    if (element) {
      element.style.borderBottom = "2px solid white";
    }
  };

  return (
    <div className="register-main-wrap">
      <Header />
      <Navbar />
      <section className="register-section-wrap">
        <h1 className="register-title">Napravi Maturko račun</h1>
        <form onSubmit={handleSubmit} id="register-form">
          <label
            htmlFor="username"
            className="register-form-lable register-form-componenet"
          >
            Korisničko ime:
          </label>
          <input
            type="text"
            id="register-username"
            className="register-form-componenet register-form-input"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onFocus={() => changeBorderOnFocus('username')}
            required
          />

          <label
            htmlFor="email"
            className="register-form-lable register-form-componenet"
          >
            Email:
          </label>
          <input
            type="text"
            id="register-email"
            className="register-form-componenet register-form-input"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => changeBorderOnFocus('email')}
            required
          />

          <label
            htmlFor="password"
            className="register-form-lable register-form-componenet"
          >
            Lozinka:
          </label>
          <input
            type="password"
            id="register-password"
            className="register-form-componenet register-form-input"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => changeBorderOnFocus('password')}
            required
          />

          <label
            htmlFor="passwordRepeat"
            className="register-form-lable register-form-componenet"
          >
            Ponovi lozinku:
          </label>
          <input
            type="password"
            id="register-passwordRepeat"
            className="register-form-componenet register-form-input"
            name="passwordRepeat"
            value={formData.passwordRepeat}
            onChange={handleChange}
            onFocus={() => changeBorderOnFocus('passwordRepeat')}
            required
          />

          <label
            id="register-form-error-msg"
            className={`register-form-lable register-form-componenet register-form-error-msg ${
              errorMsg ? "show" : ""
            }`}
          >
            {errorMsg}
          </label>

          <div className="register-form-button-wrap">
            <button
              type="submit"
              id="register-form-button"
              className="register-form-componenet"
            >
              Registriraj se
            </button>
          </div>
        </form>
        <h1 className="register-form-componenet register-text-separator">
          ili
        </h1>
        <div className="register-google-button-wrap register-form-componenet">
          <GoogleLoginButton />
        </div>
      </section>
      <Footer footerImmageClass={"footer2"} />
    </div>
  );
};

export default Register;
