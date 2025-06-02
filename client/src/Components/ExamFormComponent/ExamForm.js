import { useEffect, useState } from "react";

const ExamForm = ({ exam, subjects, onSave, onCancel }) => {
  const [formData, setFormData] = useState(exam);

  useEffect(() => {
    setFormData(exam);
  }, [exam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.title_display || !formData.subject_id || !formData.year || !formData.term) {
      alert('Molimo popunite sva obvezna polja: Prikazni naziv, Predmet, Godina, Rok.');
      return;
    }
    // Convert year to integer if it's a string from input
    const yearAsNumber = parseInt(formData.year, 10);
    if (isNaN(yearAsNumber)) {
      alert('Godina mora biti broj.');
      return;
    }
    onSave({ ...formData, year: yearAsNumber }); // Pass converted year
  };

  return (
    <div className="form-card">
      <h3>{formData.id ? 'Uredi ispit' : 'Novi ispit'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Predmet:</label>
          <select name="subject_id" value={formData.subject_id || ''} onChange={handleChange} required>
            <option value="">Odaberi predmet</option>
            {subjects.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Godina:</label>
          <input type="number" name="year" value={formData.year || ''} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Rok:</label>
          <select name="term" value={formData.term || ''} onChange={handleChange} required>
            <option value="">Odaberi rok</option>
            <option value="Ljetni rok">Ljetni rok</option>
            <option value="Jesenski rok">Jesenski rok</option>
          </select>
        </div>
        <div className="form-group">
          <label>Razina:</label>
          <select name="level" value={formData.level || ''} onChange={handleChange}>
            <option value="">N/A</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </div>
        <div className="form-group">
          <label>Prikazni naziv:</label>
          <input type="text" name="title_display" value={formData.title_display || ''} onChange={handleChange} required />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Spremi</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Odustani</button>
        </div>
      </form>
    </div>
  );
};

export default ExamForm;