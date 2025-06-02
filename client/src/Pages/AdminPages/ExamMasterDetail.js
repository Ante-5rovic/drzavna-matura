import React, { useState, useEffect, useCallback } from 'react';
import './ExamMasterDetail.css';
import QuestionForm from '../../Components/QuestionFormComponent/QuestionForm';
import ExamForm from '../../Components/ExamFormComponent/ExamForm';

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
  // NOVI STATE: Za pojam pretrage
  const [searchTerm, setSearchTerm] = useState('');

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
      // Console.log za debug - ostavljam za uvid
      console.log("Fetched exams:", data);
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
      console.log("Fetched subjects:", data);
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
      console.log("Fetched question types:", data);
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
      console.log(`Fetched questions for exam ${examId}:`, data);
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

  // --- NOVO: Handler za promjenu pretrage ---
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // --- NOVO: Filtriranje ispita ---
  const filteredExams = exams.filter(exam =>
    // Provjeri title_display i subject_name (koji dolazi s backend-a)
    (exam.title_display && exam.title_display.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (exam.subject_name && exam.subject_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  // Prikazivanje poruka za učitavanje/grešku
  if (loading && exams.length === 0 && !selectedExam) return <div className="loading">Loading exams...</div>;
  if (!loading && exams.length === 0 && !isEditingExam && !searchTerm) return <div className="no-data">Nema unesenih ispita. Kliknite "+ Novi ispit" za početak.</div>;
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

          {/* NOVO: Search komponenta */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Pretraži ispite po nazivu ili predmetu..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          {/* Ažuriran prikaz liste ispita */}
          {filteredExams.length === 0 ? (
            // Prikazuje poruku o pretrazi ako nema rezultata, inače "Nema unesenih ispita" ako je lista totalno prazna
            searchTerm ? (
              <p className="no-data">Nema ispita koji odgovaraju pretrazi "{searchTerm}".</p>
            ) : (
              // Ova poruka će se pojaviti samo ako je 'exams' prazan NAKON učitavanja i nema 'searchTerm'
              <p className="no-data">Nema unesenih ispita.</p>
            )
          ) : (
            <ul className="exam-list">
              {filteredExams.map(exam => (
                <li key={exam.id} className={selectedExam?.id === exam.id ? 'selected' : ''}>
                  <span>{exam.title_display} ({exam.year}) - {exam.subject_name}</span> {/* Dodan prikaz subject_name */}
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

export default ExamMasterDetail;