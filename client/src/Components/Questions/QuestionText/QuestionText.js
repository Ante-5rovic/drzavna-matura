// src/components/QuestionText.js

import React from 'react';
// 1. Uvozimo komponentu za renderiranje matematike iz react-katex biblioteke
import { InlineMath } from 'react-katex';
import './questionText.css'

// 2. Uvozimo našu funkciju za parsiranje
import { parseQuestionText } from './textParser'; // Prilagodi putanju ako je potrebno

const QuestionText = ({ questionText }) => {
  // 3. Pozivamo funkciju da obradi tekst i vrati nam strukturirani niz
  const parsedSegments = parseQuestionText(questionText);

  return (
    <section className='question-text'>
      {/* 4. Mapiramo kroz dobiveni niz segmenata */}
      {parsedSegments.map((segment, index) => {
        
        // 5. Ovisno o tipu segmenta, renderiramo odgovarajuću komponentu
        if (segment.type === 'math') {
          // Ako je tip 'math', koristimo <InlineMath> za prikaz formule
          return <InlineMath key={index} math={segment.value} />;
        } else {
          // Ako je tip 'text', prikazujemo ga kao običan tekst unutar <span>
          return <span key={index}>{segment.value}</span>;
        }
        
      })}
    </section>
  );
};

export default QuestionText;