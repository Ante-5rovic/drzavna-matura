import React from "react";
import { Link } from "react-router-dom";
import './examList.css'

const ExamList = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>Nema dostupnih ispita.</div>;
  }

  return (
    <div className="exam-list-main-wrap">
      <h1 className="exam-list-title">Popis online državnih matura</h1>
      <h2 className="exam-list-subtitle">
        Odaberi jednu od ponuđenih online matura i započmi s riješavanjem!!
      </h2>
      <ul>
        {data.map((exam) => (
          <li key={exam.id}>
            <Link className="exam-list-link" to={`/exam/${exam.id}`}>
              {`${exam.predmet} ${exam.year}, ${exam.term}`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExamList;
