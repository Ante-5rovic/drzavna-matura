import React, { useState, useEffect, useCallback } from 'react';
import './ExamMasterDetail.css';

// Glavni URL za vaš backend API, sada se koristi relativna putanja zbog proxyja.
// U DEVELOPMENT-u: React proxy će preusmjeriti `/api/admin` na `http://localhost:5000/api/admin`.
// U PRODUCTION-u: Morat ćete osigurati da se statične React datoteke poslužuju s istog servera
// i da se API rute također poslužuju s istog servera, ili postaviti CORS.
const API_BASE_PATH = '/admin'; 


const ExamMasterDetail = () => {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingExam, setIsEditingExam] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [message, setMessage] = useState(null); // For success/info messages


  // --- API Calls (Stvarni pozivi na backend) ---

  // Funkcija za dohvaćanje svih ispita
  const fetchExams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_PATH}/exams`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setExams(data);
    } catch (err) {
      setError('Failed to fetch exams: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Funkcija za dohvaćanje svih predmeta
  const fetchSubjects = useCallback(async () => {
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
      setError('Failed to fetch subjects: ' + err.message);
    }
  }, []);

  // Funkcija za dohvaćanje svih tipova pitanja
  const fetchQuestionTypes = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_PATH}/question-types`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setQuestionTypes(data);
    } catch (err) {
      setError('Failed to fetch question types: ' + err.message);
    }
  }, []);

  // Funkcija za dohvaćanje pitanja za odabrani ispit
  const fetchQuestionsForExam = useCallback(async (examId) => {
    if (!examId) {
      setExamQuestions([]);
      return;
    }
    setLoading(true); // Učitavanje samo za pitanja
    setError(null);
    try {
      const response = await fetch(`${API_BASE_PATH}/exams/${examId}/questions`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setExamQuestions(data);
    } catch (err) {
      setError(`Failed to fetch questions for exam ${examId}: ` + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Početno dohvaćanje svih podataka prilikom učitavanja komponente
  useEffect(() => {
    fetchExams();
    fetchSubjects();
    fetchQuestionTypes();
  }, [fetchExams, fetchSubjects, fetchQuestionTypes]); // Ovisnosti za useCallback

  // Dohvaćanje pitanja kada se odabere novi ispit
  useEffect(() => {
    if (selectedExam) {
      fetchQuestionsForExam(selectedExam.id);
    } else {
      setExamQuestions([]); // Očisti pitanja ako nema odabranog ispita
    }
  }, [selectedExam, fetchQuestionsForExam]); // Ovisnosti

  // --- Master (Exam) Handlers ---
  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    setIsEditingExam(false); // Zatvori formu za uređivanje ispita ako je otvorena
    setMessage(null);
  };

  const handleCreateNewExam = () => {
    setSelectedExam({ // Inicijaliziraj s defaultnim vrijednostima za novi ispit
      id: null,
      subject_id: subjects[0]?.id || '', // Default na prvi predmet ako postoji
      year: new Date().getFullYear(),
      term: 'Ljetni rok',
      level: '', // Prazan string za N/A ili se postavi na null
      title_display: '',
      exam_booklet_url: null,
      answer_key_url: null,
      listening_material_url: null,
    });
    setIsEditingExam(true);
    setExamQuestions([]); // Nema pitanja za novi nesačuvani ispit
    setMessage(null);
  };

  const handleEditExam = () => {
    setIsEditingExam(true);
    setMessage(null);
  };

  const handleSaveExam = async (examData) => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      let response;
      if (examData.id) {
        // UPDATE poziv na backend
        response = await fetch(`${API_BASE_PATH}/exams/${examData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(examData)
        });
      } else {
        // CREATE poziv na backend
        response = await fetch(`${API_BASE_PATH}/exams`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(examData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const savedExam = await response.json(); // Backend bi trebao vratiti spremljeni/ažurirani objekt
      setMessage('Exam saved successfully!');
      setIsEditingExam(false);
      await fetchExams(); // Ponovno dohvati sve ispite kako bi se lista ažurirala
      setSelectedExam(savedExam); // Odaberi spremljeni/ažurirani ispit
    } catch (err) {
      setError('Failed to save exam: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam and all its questions? This action cannot be undone.')) return;
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_PATH}/exams/${examId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      setMessage('Exam deleted successfully!');
      setSelectedExam(null); // Odznači nakon brisanja
      await fetchExams(); // Ponovno dohvati sve ispite kako bi se lista ažurirala
    } catch (err) {
      setError('Failed to delete exam: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Detail (Question) Handlers ---
  const handleAddQuestion = () => {
    if (!selectedExam || !selectedExam.id) {
      alert('Please select an exam first or save the new exam before adding questions.');
      return;
    }
    setCurrentQuestion({
      id: null,
      exam_id: selectedExam.id, // Poveži s trenutno odabranim ispitom
      question_type_id: questionTypes[0]?.id || '', // Default na prvi tip pitanja
      question_text: '',
      order_in_exam: examQuestions.length > 0 ? Math.max(...examQuestions.map(q => q.order_in_exam)) + 1 : 1, // Sljedeći redoslijed
      points: 1.00,
      stimulus_text: '', // Pošalji backendu kao tekst stimulusa
      correct_answer_text: '', // Za single-answer tipove
      answers: [] // Prazan niz za opcije odgovora, frontend bi morao implementirati dinamičko dodavanje polja za ovo
    });
    setIsEditingQuestion(true);
    setMessage(null);
  };

  const handleEditQuestion = (question) => {
    // Važno: kreiraj kopiju i osiguraj answers array. correct_answer_text je iz answer.answer_text za prvi odgovor ako je pojedinačni
    // Za složenije odgovore (više opcija), ova forma je rudimentarna.
    setCurrentQuestion({ 
      ...question, 
      correct_answer_text: question.answers?.find(a => a.is_correct)?.answer_text || '',
      answers: question.answers || [] 
    });
    setIsEditingQuestion(true);
    setMessage(null);
  };

  const handleSaveQuestion = async (questionData) => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      let response;
      if (questionData.id) {
        // UPDATE poziv na backend
        response = await fetch(`${API_BASE_PATH}/questions/${questionData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(questionData)
        });
      } else {
        // CREATE poziv na backend
        response = await fetch(`${API_BASE_PATH}/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(questionData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      setMessage('Question saved successfully!');
      setIsEditingQuestion(false);
      await fetchQuestionsForExam(selectedExam.id); // Ponovno dohvati pitanja za trenutni ispit
    } catch (err) {
      setError('Failed to save question: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) return;
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_PATH}/questions/${questionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      setMessage('Question deleted successfully!');
      await fetchQuestionsForExam(selectedExam.id); // Ponovno dohvati pitanja
    } catch (err) {
      setError('Failed to delete question: ' + err.message);
    } finally {
      setLoading(false);
    }
  };


  if (loading && exams.length === 0 && !selectedExam) return <div className="loading">Loading exams...</div>;
  if (!loading && exams.length === 0 && !isEditingExam) return <div className="no-data">Nema unesenih ispita. Kliknite "+ Novi ispit" za početak.</div>;
  if (error) return <div className="error-message">Error: {error}</div>;


  return (
    <div className="admin-container">
      <h1>Admin: Upravljanje ispitima i pitanjima</h1>

      {message && <div className="app-message success">{message}</div>}
      {error && <div className="app-message error">{error}</div>}

      <div className="master-detail-layout">
        {/* Master List (Exams) */}
        <div className="master-list">
          <h2>Ispiti</h2>
          <button className="btn btn-primary" onClick={handleCreateNewExam}>+ Novi ispit</button>
          {exams.length === 0 ? (
            <p>Nema unesenih ispita.</p>
          ) : (
            <ul className="exam-list">
              {exams.map(exam => (
                <li key={exam.id} className={selectedExam?.id === exam.id ? 'selected' : ''}>
                  <span>{exam.title_display} ({exam.year})</span>
                  <div className="exam-actions">
                    <button className="btn btn-secondary" onClick={() => handleSelectExam(exam)}>Pregledaj</button>
                    <button className="btn btn-danger" onClick={() => handleDeleteExam(exam.id)}>Obriši</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Master Detail / Edit Form (Exam) */}
        <div className="master-detail-view">
          {isEditingExam ? (
            <ExamForm
              exam={selectedExam}
              subjects={subjects}
              onSave={handleSaveExam}
              onCancel={() => { setIsEditingExam(false); if (!selectedExam?.id) setSelectedExam(null); }}
            />
          ) : (
            selectedExam && (
              <div className="selected-exam-view">
                <h2>Detalji ispita: {selectedExam.title_display}</h2>
                <p><strong>Predmet:</strong> {selectedExam.subject_name}</p>
                <p><strong>Godina:</strong> {selectedExam.year}</p>
                <p><strong>Rok:</strong> {selectedExam.term}</p>
                <p><strong>Razina:</strong> {selectedExam.level || 'N/A'}</p>
                <button className="btn btn-secondary" onClick={handleEditExam}>Uredi ispit</button>

                {/* Detail List (Questions) */}
                <h3 className="detail-heading">Pitanja ({examQuestions.length})</h3>
                <button className="btn btn-primary" onClick={handleAddQuestion}>+ Dodaj pitanje</button>
                {loading && selectedExam.id ? ( // Show loading for questions only if exam selected
                    <div className="loading">Loading questions...</div>
                ) : examQuestions.length === 0 ? (
                    <p>Nema pitanja za ovaj ispit.</p>
                ) : (
                  <ul className="question-list">
                    {examQuestions.map(question => (
                      <li key={question.id}>
                        <span>{question.order_in_exam}. {question.question_text.substring(0, Math.min(question.question_text.length, 100))}... ({question.points}b)</span>
                        <div className="question-actions">
                          <button className="btn btn-secondary" onClick={() => handleEditQuestion(question)}>Uredi</button>
                          <button className="btn btn-danger" onClick={() => handleDeleteQuestion(question.id)}>Obriši</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          )}
        </div>

        {/* Question Edit/Create Form (Modal) */}
        {isEditingQuestion && (
          <QuestionForm
            question={currentQuestion}
            questionTypes={questionTypes}
            onSave={handleSaveQuestion}
            onCancel={() => setIsEditingQuestion(false)}
          />
        )}
      </div>
    </div>
  );
};

// --- Child Components ---

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

const QuestionForm = ({ question, questionTypes, onSave, onCancel }) => {
  const [formData, setFormData] = useState(question);
  const [answers, setAnswers] = useState(question.answers || []); // State for answer options

  useEffect(() => {
    setFormData(question);
    setAnswers(question.answers || []);
  }, [question]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newAnswers = answers.map((ans, i) => {
      if (i === index) {
        if (name === 'is_correct') {
          // Ensure only one answer is correct for single-choice types
          return { ...ans, is_correct: checked };
        }
        return { ...ans, [name]: value };
      }
      return ans;
    });
    setAnswers(newAnswers);
  };

  const handleAddAnswer = () => {
    setAnswers(prev => [...prev, {
      answer_text: '',
      is_correct: false,
      order_in_question: prev.length + 1
    }]);
  };

  const handleRemoveAnswer = (index) => {
    setAnswers(prev => prev.filter((_, i) => i !== index).map((ans, i) => ({
      ...ans,
      order_in_question: i + 1 // Re-order after removal
    })));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.question_text || !formData.question_type_id || !formData.points) {
      alert('Molimo popunite sva obvezna polja: Tekst pitanja, Tip pitanja, Bodovi.');
      return;
    }

    const pointsAsNumber = parseFloat(formData.points);
    if (isNaN(pointsAsNumber) || pointsAsNumber <= 0) {
        alert('Bodovi moraju biti pozitivan broj.');
        return;
    }
    const orderAsNumber = parseInt(formData.order_in_exam, 10);
    if (isNaN(orderAsNumber) || orderAsNumber <= 0) {
        alert('Redoslijed u ispitu mora biti pozitivan cijeli broj.');
        return;
    }

    // Dodatna validacija za odgovore
    const isMultipleChoice = ['MULTIPLE_CHOICE_SINGLE', 'MULTIPLE_CHOICE_MULTIPLE'].includes(questionTypes.find(qt => qt.id === formData.question_type_id)?.type_code);
    if (isMultipleChoice) {
      if (answers.length === 0) {
        alert('Za višestruki izbor morate imati barem jednu opciju odgovora.');
        return;
      }
      const correctAnswersCount = answers.filter(a => a.is_correct).length;
      if (correctAnswersCount === 0) {
        alert('Morate označiti barem jedan točan odgovor.');
        return;
      }
      if (questionTypes.find(qt => qt.id === formData.question_type_id)?.type_code === 'MULTIPLE_CHOICE_SINGLE' && correctAnswersCount > 1) {
        alert('Za tip "Višestruki izbor - jedan točan" smijete imati samo jedan točan odgovor.');
        return;
      }
    } else if (['FILL_IN_BLANK', 'EXTENDED_RESPONSE'].includes(questionTypes.find(qt => qt.id === formData.question_type_id)?.type_code)) {
      // For FILL_IN_BLANK or EXTENDED_RESPONSE, we expect a single correct_answer_text
      if (!formData.correct_answer_text) {
        alert('Molimo unesite točan odgovor za ovaj tip pitanja.');
        return;
      }
    }


    onSave({
      ...formData,
      points: pointsAsNumber,
      order_in_exam: orderAsNumber,
      answers: answers // Pošalji i opcije odgovora
    });
  };

  // Provjeravamo je li trenutni tip pitanja višestruki izbor (za prikaz opcija odgovora)
  const currentQuestionTypeCode = questionTypes.find(qt => qt.id === formData.question_type_id)?.type_code;
  const showAnswerOptions = ['MULTIPLE_CHOICE_SINGLE', 'MULTIPLE_CHOICE_MULTIPLE'].includes(currentQuestionTypeCode);
  const showSingleCorrectAnswerText = ['FILL_IN_BLANK', 'EXTENDED_RESPONSE', 'povezivanje', 'povezivanje_poruka', 'popunjavanje_praznine_recenica', 'popunjavanje_praznine_rijec', 'popunjavanje_praznine_odgovor'].includes(currentQuestionTypeCode);


  return (
    <div className="form-card question-form-modal">
      <div className="modal-content">
        <h3>{formData.id ? 'Uredi pitanje' : 'Novo pitanje'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tekst pitanja:</label>
            <textarea name="question_text" value={formData.question_text || ''} onChange={handleChange} required></textarea>
          </div>
          <div className="form-group">
            <label>Redoslijed u ispitu:</label>
            <input type="number" name="order_in_exam" value={formData.order_in_exam || ''} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Bodovi:</label>
            <input type="number" step="0.01" name="points" value={formData.points || ''} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Tip pitanja:</label>
            <select name="question_type_id" value={formData.question_type_id || ''} onChange={handleChange} required>
              <option value="">Odaberi tip pitanja</option>
              {questionTypes.map(qt => (
                <option key={qt.id} value={qt.id}>{qt.description} ({qt.type_code})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Polazni tekst (Stimulus):</label>
            <textarea name="stimulus_text" value={formData.stimulus_text || ''} onChange={handleChange} placeholder="Unesite puni tekst stimulusa, ako postoji."></textarea>
          </div>

          {showSingleCorrectAnswerText && (
            <div className="form-group">
              <label>Točan odgovor (tekst/oznaka):</label>
              <input type="text" name="correct_answer_text" value={formData.correct_answer_text || ''} onChange={handleChange} required />
            </div>
          )}

          {showAnswerOptions && (
            <div className="answer-options-group">
              <label>Opcije odgovora:</label>
              {answers.map((answer, index) => (
                <div key={index} className="answer-option-item">
                  <input
                    type="text"
                    name="answer_text"
                    value={answer.answer_text || ''}
                    onChange={(e) => handleAnswerChange(index, e)}
                    placeholder={`Opcija ${String.fromCharCode(65 + index)}.`}
                    required
                  />
                  <label className="is-correct-label">
                    Točan:
                    <input
                      type="checkbox"
                      name="is_correct"
                      checked={answer.is_correct}
                      onChange={(e) => {
                        // Logic for single-choice type_code (only one checked)
                        if (currentQuestionTypeCode === 'MULTIPLE_CHOICE_SINGLE' && e.target.checked) {
                          setAnswers(prev => prev.map((ans, i) => 
                            i === index ? { ...ans, is_correct: true } : { ...ans, is_correct: false }
                          ));
                        } else {
                          handleAnswerChange(index, e);
                        }
                      }}
                    />
                  </label>
                  <button type="button" className="btn btn-danger btn-small" onClick={() => handleRemoveAnswer(index)}>Ukloni</button>
                </div>
              ))}
              <button type="button" className="btn btn-secondary btn-small" onClick={handleAddAnswer}>+ Dodaj opciju</button>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Spremi pitanje</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Odustani</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamMasterDetail;