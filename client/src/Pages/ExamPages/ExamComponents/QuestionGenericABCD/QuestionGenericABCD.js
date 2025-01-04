import React from "react";
import "./questionGenericABCD.css";

const QuestionGenericABCD = ({ zadatak, selectedAnswer, onSelectAnswer }) => {
  /*
   * Funkcija koja se poziva kad korisnik klikne na ponuđeni odgovor.
   * 'answer' = 'A', 'B', 'C' ili 'D'
   */
  const handleClick = (answer) => {
    // Pozivamo callback koji nam je došao iz glavne komponente
    onSelectAnswer(zadatak.brojZadatka, answer);
  };

  const { A, B, C, D } = zadatak.ponudeniOdgovori;

  /*
   * Provjeravamo je li odgovor iz selectedAnswer jednak 'A', 'B', 'C' ili 'D'.
   * Ako jest, dodajemo klasu "selected-answer".
   */
  return (
    <div>
      <h4>
        {zadatak.brojZadatka}. {zadatak.pitanje}
      </h4>
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        <li
          className={
            "answer-option " + (selectedAnswer === "A" ? "selected-answer" : "")
          }
          onClick={() => handleClick("A")}
        >
          A) {A}
        </li>
        <li
          className={
            "answer-option " + (selectedAnswer === "B" ? "selected-answer" : "")
          }
          onClick={() => handleClick("B")}
        >
          B) {B}
        </li>
        <li
          className={
            "answer-option " + (selectedAnswer === "C" ? "selected-answer" : "")
          }
          onClick={() => handleClick("C")}
        >
          C) {C}
        </li>
        <li
          className={
            "answer-option " + (selectedAnswer === "D" ? "selected-answer" : "")
          }
          onClick={() => handleClick("D")}
        >
          D) {D}
        </li>
      </ul>
    </div>
  );
};

export default QuestionGenericABCD;
