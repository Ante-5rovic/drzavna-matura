import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    email: null,
    username: null,
    role: null,
  });

  useEffect(() => {
    // Automatski dohvat podataka prilikom inicijalizacije
    const fetchUserData = async () => {
      try {
        const response = await fetch('/get-user-data', {
          method: 'GET',
          credentials: 'include', // Pošalji kolačiće u zahtjev
        });

        if (!response.ok) {
          throw new Error('Korisnik nije prijavljen.');
        }

        const userData = await response.json();
        setAuthState({
          ...userData,
          token: true, // Signalizira da je korisnik prijavljen
        });
      } catch (error) {
        console.error('Greška pri dohvaćanju korisničkih podataka:', error);
        setAuthState({
          token: null,
          email: null,
          username: null,
          role: null,
        });
      }
    };

    fetchUserData();
  }, []);

  const login = (data) => {
    // Kasnije ce trebati promjeniti kad dojdu druge role
    setAuthState({
      token: null, //<--------------- treba i njega dodati!!
      email: data.user.email,
      username: data.user.username,
      role: data.user.role,
    }); 
  };

  const logout = () => {
    setAuthState({
      token: null,
      email: null,
      username: null,
      role: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
