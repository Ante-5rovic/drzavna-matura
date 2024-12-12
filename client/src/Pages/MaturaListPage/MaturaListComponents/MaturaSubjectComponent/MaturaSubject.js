import React from "react";
import ExamList from "../ExamListComponent/ExamList";
import "./maturaSubject.css";
import MaturaGenerator from "../MaturaGeneratorComponent/MaturaGeneratorr";
import SavedQuestions from "../../../../Components/SavedQuestionsComponent/SavedQuestions"

const MaturaSubject = ({ data }) => {
  return (
    <main className="matura-subject-main-wrap">
      <section className="matura-subject-section-wrap">
        <ExamList data={data} />
      </section>
      <div className="matura-subject-separator"></div>
      <section className="matura-subject-section-wrap">
        Tu ce ici chechbox za pokretaje testnog nacina mature
      </section>
      <div className="matura-subject-separator"></div>
      <section className="matura-subject-section-wrap">
        <MaturaGenerator/>
      </section>
      <div className="matura-subject-separator"></div>
      <section className="matura-subject-section-wrap">
      
      </section>
      <SavedQuestions/>
    </main>
  );
};

export default MaturaSubject;
