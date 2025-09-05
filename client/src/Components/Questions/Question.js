import React from "react";
import "./question.css";
import QuestionText from "./QuestionText/QuestionText";

const Question = ({ questionData }) => {
  return (
    <div className="question-main-container">
      <div className="question-container">
        <section className="question-number">
          <h1 className="question-number-text">
            {questionData.order_in_exam}.
          </h1>
        </section>
        <section className="question">
          <div className="question-text-wrap">
            <QuestionText questionText={questionData.question_text} />
          </div>
          <div className="question-answers-wrap"></div>
        </section>
      </div>
      <div className="question-points-wrap">
        <h1 className="question-points">({questionData.points})</h1>
      </div>
    </div>
  );
};

export default Question;
