import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = () => {
  const handleLoginSuccess = (response) => {
    console.log("ID Token:", response.credential);
    // Google prijava!
    // Pošalji ID token backendu za validaciju
    // Ako ne postoji, stvori novi korisnički zapis i pohrani informacije.
    // Ako postoji, tretiraj to kao prijavu.
  };

  const handleLoginError = () => {
    console.error("Login Failed");
    // Google prijava error!
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
