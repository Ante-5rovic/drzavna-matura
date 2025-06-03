import React, { useState, useEffect, useCallback } from 'react';
import './SubjectManagement.css';

const API_BASE_PATH = '/admin';

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [subjectName, setSubjectName] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_PATH}/subjects`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSubjects(data);
    } catch (err) {
      setError('Greška pri dohvaćanju predmeta: ' + err.message);
      setSubjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleInputChange = (e) => {
    setSubjectName(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openFormForNew = () => {
    setCurrentSubject(null);
    setSubjectName('');
    setIsFormVisible(true);
    setError(null);
    setMessage(null);
  };

  const openFormForEdit = (subject) => {
    setCurrentSubject(subject);
    setSubjectName(subject.name);
    setIsFormVisible(true);
    setError(null);
    setMessage(null);
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setCurrentSubject(null);
    setSubjectName('');
  };

  const handleSubmitSubject = async (e) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      setError('Naziv predmeta ne može biti prazan.');
      return;
    }
    setError(null);
    setMessage(null);
    setIsLoading(true);

    const method = currentSubject ? 'PUT' : 'POST';
    const url = currentSubject
      ? `${API_BASE_PATH}/subjects/${currentSubject.id}`
      : `${API_BASE_PATH}/subjects`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: subjectName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! ${response.status}`);
      }

      setMessage(`Predmet uspješno ${currentSubject ? 'ažuriran' : 'spremljen'}!`);
      closeForm();
      await fetchSubjects();
    } catch (err) {
      setError(`Greška: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubject = async (subjectId, subjectNameStr) => {
    if (!window.confirm(`Jeste li sigurni da želite obrisati predmet "${subjectNameStr}"?`)) {
      return;
    }
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_PATH}/subjects/${subjectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! ${response.status}`);
      }
      setMessage(`Predmet "${subjectNameStr}" uspješno obrisan.`);
      await fetchSubjects();
    } catch (err) {
      setError(`Greška pri brisanju predmeta: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="subject-management-container">
      <h2>Upravljanje predmetima</h2>

      {message && <div className="app-message success" onClick={() => setMessage(null)}>{message}</div>}
      {error && <div className="app-message error" onClick={() => setError(null)}>{error}</div>}

      <div className="actions-bar">
        <button className="btn btn-primary" onClick={openFormForNew} disabled={isFormVisible}>
          + Dodaj novi predmet
        </button>
        <input
          type="text"
          placeholder="Pretraži predmete..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input-subjects"
          disabled={isFormVisible}
        />
      </div>

      {isFormVisible && (
        <div className="form-card subject-form">
          <h3>{currentSubject ? 'Uredi predmet' : 'Novi predmet'}</h3>
          <form onSubmit={handleSubmitSubject}>
            <div className="form-group">
              <label htmlFor="subjectName">Naziv predmeta:</label>
              <input
                type="text"
                id="subjectName"
                value={subjectName}
                onChange={handleInputChange}
                required
                autoFocus
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Spremanje...' : (currentSubject ? 'Ažuriraj' : 'Spremi')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={closeForm} disabled={isLoading}>
                Odustani
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading && subjects.length === 0 && <div className="loading">Učitavanje predmeta...</div>}
      
      {!isLoading && subjects.length === 0 && !error && (
        <p className="no-data">Nema unesenih predmeta. Dodajte novi.</p>
      )}

      {filteredSubjects.length > 0 && (
        <table className="subjects-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Naziv predmeta</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.id}</td>
                <td>{subject.name}</td>
                <td className="actions-cell">
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => openFormForEdit(subject)}
                    disabled={isFormVisible || isLoading}
                  >
                    Uredi
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleDeleteSubject(subject.id, subject.name)}
                    disabled={isFormVisible || isLoading}
                  >
                    Obriši
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
       {subjects.length > 0 && filteredSubjects.length === 0 && searchTerm && (
         <p className="no-data">Nema predmeta koji odgovaraju pretrazi "{searchTerm}".</p>
       )}
    </div>
  );
};

export default SubjectManagement;