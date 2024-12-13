import React, { useState } from "react";
import ExamList from "../ExamListComponent/ExamList";
import "./maturaSubject.css";
import MaturaGenerator from "../MaturaGeneratorComponent/MaturaGeneratorr";
import SavedQuestions from "../../../../Components/SavedQuestionsComponent/SavedQuestions";

const MaturaSubject = ({ data }) => {
  const [isSimulationActive, setSimulationActive] = useState(false);

  const toggleSimulation = () => {
    // Ideja je ako je ovaj checkbox ukljucen da onda kad pristupis nekom od ispita ili recimo generiranoj maturi
    // Ona bude u tesnom nacinu rada (nema prikazanih odgovora i vrime traje 3 h, odnosno ovisno o duljini rijesavanja pojedine mature)
    setSimulationActive(!isSimulationActive);
  };

  return (
    <main className="matura-subject-main-wrap">
      <section className="matura-subject-section-wrap">
        <ExamList data={data} />
      </section>
      <div className="matura-subject-separator"></div>
      <section className="matura-subject-section-wrap matura-subject-checkbox-main-wrap">
        <h1 className="matura-subject-checkbox-title">
          Simulacija državne mature
        </h1>
        <h2 className="matura-subject-checkbox-subtitle">
          Ako želiš vježbati rješavanje državne mature s uvjetima koje češ imati
          na ispitu, bez prikazanih rješenja i s vremenskim ograničenjem, klikni
          tekst ispod. Nakon što si odabrao opciju simulacije državne mature
          klikni na bilo koju maturu s liste prethodnih matura ili odaberi
          opciju generiranja nove mature!!
        </h2>
        <p
          className={`matura-subject-checkbox-subtitle matura-subject-checkbox-simulation-text ${isSimulationActive ? 'active' : ''}`}
          onClick={toggleSimulation}
          style={{ cursor: "pointer" }}
        >
          {isSimulationActive
            ? "Simulacija mature je aktivirana"
            : "Simulacija mature nije aktivirana"}
        </p>
      </section>
      <div className="matura-subject-separator"></div>
      <section className="matura-subject-section-wrap">
        <MaturaGenerator />
      </section>
      <div className="matura-subject-separator"></div>
      <section className="matura-subject-section-wrap">
        <SavedQuestions />
      </section>
    </main>
  );
};

export default MaturaSubject;
