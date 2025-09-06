import React from "react";
import Question from "../../../../Components/Questions/Question";
import "./examQuestionWraper.css"


const ExamQuestionWraper = ({ questionsData }) => {

  if (!questionsData) {
    return <div>Učitavanje pitanja...</div>;
  }

  return (
    <div className="exam-question-wraper">
      {questionsData.map((question, index) => (
        <Question
          key={question.id || index}
          questionData={question}
        />
      ))}
    </div>
  );
};

export default ExamQuestionWraper;