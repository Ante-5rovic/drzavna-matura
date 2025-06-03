import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <h1>Administratorska ploča</h1>
      <p>Dobrodošli u administratorsko sučelje. Odaberite opciju za upravljanje:</p>
      <div className="admin-options">
        <Link to="/admin/exams" className="admin-option-card">
          <div className="option-icon">🛠️</div>
          <h2>Upravljanje Ispitima i Pitanjima</h2>
          <p>Kreirajte, uređujte i brišite ispite te njihova pripadajuća pitanja.</p>
        </Link>
        <Link to="/admin/subjects" className="admin-option-card">
          <div className="option-icon">📚</div>
          <h2>Upravljanje predmetima</h2>
          <p>Administrirajte listu predmeta koji se koriste za ispite.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;