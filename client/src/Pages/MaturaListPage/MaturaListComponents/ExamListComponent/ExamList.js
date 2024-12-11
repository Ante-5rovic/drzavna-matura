import React from "react";
import { Link } from "react-router-dom";

const ExamList = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>Nema dostupnih ispita.</div>;
  }

  return (
    <div>
      <h1>Popis ispita</h1>
      <ul>
        {data.map((exam) => (
          <li key={exam.id}>
            <Link to={`/exam/${exam.id}`}>
              {`${exam.predmet} ${exam.year}, ${exam.term}`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExamList;
