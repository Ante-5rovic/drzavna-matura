import React, { useState } from 'react';
import Question from './QuestionComponent/Question';
import './savedQuestions.css';

const SavedQuestions = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: 'Pitanje 1',
      text: 'Ovo je prvi dio teksta pitanja 1...',
      color: null,
    },
    {
      id: 2,
      title: 'Pitanje 2',
      text: 'Ovo je početak teksta pitanja 2...',
      color: null,
    },
    {
      id: 3,
      title: 'Pitanje 3',
      text: 'Ovdje ide uvod teksta pitanja 3...',
      color: null,
    },
    {
      id: 4,
      title: 'Pitanje 4',
      text: 'Ovdje ide uvod teksta pitanja 4...',
      color: null,
    },
    {
      id: 5,
      title: 'Pitanje 5',
      text: 'Ovdje ide uvod teksta pitanja 5...',
      color: null,
    },
    {
      id: 6,
      title: 'Pitanje 6',
      text: 'Ovdje ide uvod teksta pitanja 6...',
      color: null,
    },
  ]);

  const [selectedColor, setSelectedColor] = useState('#ddd');

  const colorPalette = [
    '#ddd',
    '#F44336',  
    '#E91E63', 
    '#9C27B0',  
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50',
  ];

  const handleSelectColor = (color) => {
    setSelectedColor(color);
  };

  const handleClickQuestion = (id) => {
    if (!selectedColor) return;

    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, color: selectedColor } : q
      )
    );
  };

  const handleDelete = (id) => {
    const newQuestions = questions.filter((question) => question.id !== id);
    setQuestions(newQuestions);
  };

  return (
    <main className="saved-questions-main-wrap">
      <section className="saved-questions-color-palette">
        {colorPalette.map((color) => {
          const isSelected = color === selectedColor;

          return (
            <div
              key={color}
              className="saved-questions-color-swatch"
              style={{
                backgroundColor: color,
                border: isSelected ? '3px solid #000' : '3px solid transparent',
              }}
              onClick={() => handleSelectColor(color)}
            />
          );
        })}
      </section>

      <section className="saved-questions-questions-wrap">
        {questions.map((q) => (
          <Question
            key={q.id}
            id={q.id}
            title={q.title}
            text={q.text}
            color={q.color}
            onDelete={() => handleDelete(q.id)}
            onClick={() => handleClickQuestion(q.id)}
          />
        ))}
      </section>
    </main>
  );
};

export default SavedQuestions;
