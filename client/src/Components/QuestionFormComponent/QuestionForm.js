import { useEffect, useState } from "react";
import './qusetionsForm.css'

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

export default QuestionForm;