import React, { useState, useEffect, useCallback } from 'react';
import './ExamMasterDetail.css';
import QuestionForm from '../../Components/QuestionFormComponent/QuestionForm'; // Pretpostavljam da su putanje ispravne
import ExamForm from '../../Components/ExamFormComponent/ExamForm';       // Pretpostavljam da su putanje ispravne

const API_BASE_PATH = '/admin'; // Koristimo /api/admin kao što je u app.js

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
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // NOVO: State za dodavanje novog predmeta
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [loadingSubjects, setLoadingSubjects] = useState(false);


  // --- API Calls ---
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
      setError('Greška pri dohvaćanju ispita: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    setLoadingSubjects(true); // Koristi poseban loading state za predmete
    // setError(null); // Opcionalno, možeš imati odvojen error state za predmete
    try {
      const response = await fetch(`${API_BASE_PATH}/subjects`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSubjects(data);
    } catch (err) {
      setError(prevError => prevError ? prevError + '; Greška pri dohvaćanju predmeta: ' + err.message : 'Greška pri dohvaćanju predmeta: ' + err.message);
    } finally {
        setLoadingSubjects(false);
    }
  }, []);

  const fetchQuestionTypes = useCallback(async () => {
    // setError(null);
    try {
      const response = await fetch(`${API_BASE_PATH}/question-types`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setQuestionTypes(data);
    } catch (err) {
      setError(prevError => prevError ? prevError + '; Greška pri dohvaćanju tipova pitanja: ' + err.message : 'Greška pri dohvaćanju tipova pitanja: ' + err.message);
    }
  }, []);

  const fetchQuestionsForExam = useCallback(async (examId) => {
    if (!examId) {
      setExamQuestions([]);
      return;
    }
    // setLoading(true); // Već se postavlja globalni loading, može se specificirati
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
      setError(`Greška pri dohvaćanju pitanja za ispit ${examId}: ` + err.message);
    } finally {
      // setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
    fetchSubjects();
    fetchQuestionTypes();
  }, [fetchExams, fetchSubjects, fetchQuestionTypes]);

  useEffect(() => {
    if (selectedExam && selectedExam.id) { // Samo ako ispit ima ID (tj. nije novi, nespremljeni ispit)
      fetchQuestionsForExam(selectedExam.id);
    } else {
      setExamQuestions([]);
    }
  }, [selectedExam, fetchQuestionsForExam]);

  // --- Master (Exam) Handlers ---
  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    setIsEditingExam(false);
    setMessage(null);
    setError(null);
  };

  const handleCreateNewExam = () => {
    setSelectedExam({
      id: null,
      subject_id: subjects[0]?.id || '',
      year: new Date().getFullYear(),
      term: 'Ljetni rok',
      level: '',
      title_display: '',
    });
    setIsEditingExam(true);
    setExamQuestions([]);
    setMessage(null);
    setError(null);
  };

  const handleEditExam = () => {
    if (!selectedExam) return;
    setIsEditingExam(true);
    setMessage(null);
    setError(null);
  };

  const handleSaveExam = async (examData) => {
    // setLoading(true); // Možeš koristiti specifični loading state za spremanje
    setMessage(null);
    setError(null);
    try {
      let response;
      const method = examData.id ? 'PUT' : 'POST';
      const url = examData.id ? `${API_BASE_PATH}/exams/${examData.id}` : `${API_BASE_PATH}/exams`;

      response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const savedExam = await response.json();
      setMessage('Ispit uspješno spremljen!');
      setIsEditingExam(false);
      await fetchExams();
      // Ako je bio novi ispit, postavi ga kao odabrani
      // Ako je bio update, odabrani ispit će se automatski osvježiti u listi
      const newSelectedExam = exams.find(e => e.id === savedExam.id) || savedExam;
      setSelectedExam(newSelectedExam);

    } catch (err) {
      setError('Greška pri spremanju ispita: ' + err.message);
    } finally {
      // setLoading(false);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovaj ispit i sva povezana pitanja? Ova akcija se ne može poništiti.')) return;
    // setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_PATH}/exams/${examId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      setMessage('Ispit uspješno obrisan!');
      setSelectedExam(null);
      await fetchExams();
    } catch (err) {
      setError('Greška pri brisanju ispita: ' + err.message);
    } finally {
      // setLoading(false);
    }
  };

  // --- Detail (Question) Handlers ---
  const handleAddQuestion = () => {
    if (!selectedExam || !selectedExam.id) {
      alert('Molimo prvo odaberite ili spremite ispit prije dodavanja pitanja.');
      return;
    }
    setCurrentQuestion({
      id: null,
      exam_id: selectedExam.id,
      question_type_id: questionTypes[0]?.id || '',
      question_text: '',
      order_in_exam: examQuestions.length > 0 ? Math.max(0, ...examQuestions.map(q => q.order_in_exam)) + 1 : 1,
      points: 1.00,
      stimulus_text: '',
      correct_answer_text: '',
      answers: []
    });
    setIsEditingQuestion(true);
    setMessage(null);
    setError(null);
  };

  const handleEditQuestion = (question) => {
    const questionTypeCode = questionTypes.find(qt => qt.id === question.question_type_id)?.type_code;
    const isMC = ['MULTIPLE_CHOICE_SINGLE', 'MULTIPLE_CHOICE_MULTIPLE'].includes(questionTypeCode);
    
    setCurrentQuestion({
      ...question,
      // Ako nije MC, a postoji answers array, correct_answer_text je prvi točan odgovor
      // Ovo pretpostavlja da za ne-MC pitanja točan odgovor može biti spremljen u answers polju na backendu
      correct_answer_text: !isMC && question.answers && question.answers.find(a => a.is_correct)
                           ? question.answers.find(a => a.is_correct).answer_text
                           : (question.correct_answer_text || ''), // Ako je već poslan odvojeno
      answers: question.answers || []
    });
    setIsEditingQuestion(true);
    setMessage(null);
    setError(null);
  };

  const handleSaveQuestion = async (questionData) => {
    // setLoading(true);
    setMessage(null);
    setError(null);
    try {
      let response;
      const method = questionData.id ? 'PUT' : 'POST';
      const url = questionData.id ? `${API_BASE_PATH}/questions/${questionData.id}` : `${API_BASE_PATH}/questions`;

      response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      setMessage('Pitanje uspješno spremljeno!');
      setIsEditingQuestion(false);
      if (selectedExam && selectedExam.id) {
        await fetchQuestionsForExam(selectedExam.id);
      }
    } catch (err) {
      setError('Greška pri spremanju pitanja: ' + err.message);
    } finally {
      // setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovo pitanje? Ova akcija se ne može poništiti.')) return;
    // setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_PATH}/questions/${questionId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      setMessage('Pitanje uspješno obrisano!');
      if (selectedExam && selectedExam.id) {
        await fetchQuestionsForExam(selectedExam.id);
      }
    } catch (err) {
      setError('Greška pri brisanju pitanja: ' + err.message);
    } finally {
      // setLoading(false);
    }
  };

  // --- NOVO: Subject Handlers ---
  const handleAddNewSubject = () => {
    setNewSubjectName('');
    setIsAddingSubject(true);
    setMessage(null);
    setError(null);
  };

  const handleSaveNewSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) {
      alert('Naziv predmeta ne može biti prazan.');
      return;
    }
    setLoadingSubjects(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_PATH}/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubjectName.trim() })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const addedSubject = await response.json();
      setSubjects(prevSubjects => [...prevSubjects, addedSubject].sort((a, b) => a.name.localeCompare(b.name)));
      setMessage(`Predmet "${addedSubject.name}" uspješno dodan!`);
      setIsAddingSubject(false);
      setNewSubjectName('');
    } catch (err) {
      setError('Greška pri dodavanju novog predmeta: ' + err.message);
    } finally {
      setLoadingSubjects(false);
    }
  };


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredExams = exams.filter(exam =>
    (exam.title_display && exam.title_display.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (exam.subject_name && exam.subject_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && exams.length === 0 && !selectedExam && !isAddingSubject) return <div className="loading">Učitavanje ispita...</div>;
  // Ne prikazuj "Nema unesenih ispita" ako je forma za dodavanje predmeta otvorena
  if (!loading && exams.length === 0 && !isEditingExam && !searchTerm && !isAddingSubject && !selectedExam) {
      return (
          <div className="admin-container">
            <h1>Admin: Upravljanje ispitima i pitanjima</h1>
             {message && <div className="app-message success">{message}</div>}
             {error && <div className="app-message error">{error}</div>}
            <div className="master-list">
                <h2>Ispiti</h2>
                <button className="btn btn-primary" onClick={handleCreateNewExam}>+ Novi ispit</button>
                <button className="btn btn-secondary" onClick={handleAddNewSubject} style={{marginLeft: '10px'}}>+ Novi predmet</button>
                 {isAddingSubject && (
                    <div className="form-card subject-form-inline">
                        <h3>Dodaj novi predmet</h3>
                        <form onSubmit={handleSaveNewSubject}>
                        <div className="form-group">
                            <label htmlFor="newSubjectName">Naziv predmeta:</label>
                            <input
                                type="text"
                                id="newSubjectName"
                                value={newSubjectName}
                                onChange={(e) => setNewSubjectName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={loadingSubjects}>
                                {loadingSubjects ? 'Spremanje...' : 'Spremi predmet'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => setIsAddingSubject(false)} disabled={loadingSubjects}>
                                Odustani
                            </button>
                        </div>
                        </form>
                    </div>
                )}
                <p className="no-data">Nema unesenih ispita.</p>
            </div>
          </div>
      );
  }


  return (
    <div className="admin-container">
      <h1>Admin: Upravljanje ispitima i pitanjima</h1>

      {message && <div className="app-message success" onClick={() => setMessage(null)}>{message}</div>}
      {error && <div className="app-message error" onClick={() => setError(null)}>{error}</div>}

      {/* Forma za dodavanje novog predmeta - može biti uvijek vidljiva ili kao modal */}
      {isAddingSubject && (
        <div className="modal-overlay">
          <div className="form-card subject-form-modal"> {/* Koristi sličan stil kao QuestionForm */}
            <h3>Dodaj novi predmet</h3>
            <form onSubmit={handleSaveNewSubject}>
              <div className="form-group">
                <label htmlFor="newSubjectName">Naziv predmeta:</label>
                <input
                  type="text"
                  id="newSubjectName"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loadingSubjects}>
                  {loadingSubjects ? 'Spremanje...' : 'Spremi predmet'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddingSubject(false)} disabled={loadingSubjects}>
                  Odustani
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      <div className="master-detail-layout">
        <div className="master-list">
          <h2>Ispiti</h2>
          <div className="master-actions">
            <button className="btn btn-primary" onClick={handleCreateNewExam}>+ Novi ispit</button>
            {/* NOVO: Gumb za dodavanje predmeta */}
            <button className="btn btn-secondary" onClick={handleAddNewSubject} style={{ marginLeft: '10px' }}>+ Novi predmet</button>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Pretraži ispite po nazivu ili predmetu..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          {loading && exams.length === 0 ? <div className="loading-inline">Učitavam ispite...</div> : null}
          {filteredExams.length === 0 && !loading ? (
            searchTerm ? (
              <p className="no-data">Nema ispita koji odgovaraju pretrazi "{searchTerm}".</p>
            ) : (
              exams.length > 0 ? null : <p className="no-data">Nema unesenih ispita.</p> // Prikazi samo ako je exams zaista prazan
            )
          ) : (
            <ul className="exam-list">
              {filteredExams.map(exam => (
                <li key={exam.id} className={selectedExam?.id === exam.id ? 'selected' : ''} onClick={() => handleSelectExam(exam)}>
                  <span>{exam.title_display} ({exam.year}) - {exam.subject_name}</span>
                  <div className="exam-actions">
                    {/* <button className="btn btn-secondary btn-small" onClick={(e) => {e.stopPropagation(); handleSelectExam(exam);}}>Pregledaj</button> */}
                    <button className="btn btn-danger btn-small" onClick={(e) => { e.stopPropagation(); handleDeleteExam(exam.id); }}>Obriši</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

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

                <h3 className="detail-heading">Pitanja ({examQuestions.length})</h3>
                <button className="btn btn-primary" onClick={handleAddQuestion}>+ Dodaj pitanje</button>
                {loading && selectedExam.id ? (
                  <div className="loading-inline">Učitavam pitanja...</div>
                ) : examQuestions.length === 0 ? (
                  <p>Nema pitanja za ovaj ispit.</p>
                ) : (
                  <ul className="question-list">
                    {examQuestions.map(question => (
                      <li key={question.id}>
                        <span>{question.order_in_exam}. {question.question_text.substring(0, Math.min(question.question_text.length, 100))}... ({question.points}b)</span>
                        <div className="question-actions">
                          <button className="btn btn-secondary btn-small" onClick={() => handleEditQuestion(question)}>Uredi</button>
                          <button className="btn btn-danger btn-small" onClick={() => handleDeleteQuestion(question.id)}>Obriši</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          )}
          {!isEditingExam && !selectedExam && exams.length > 0 && (
            <p className="no-data-placeholder">Odaberite ispit za prikaz detalja ili kreirajte novi.</p>
          )}
        </div>

        {isEditingQuestion && currentQuestion && ( // Osiguraj da currentQuestion postoji
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