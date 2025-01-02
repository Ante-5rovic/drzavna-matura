import React, { useState, useEffect } from "react";
import ExamList from "../ExamListComponent/ExamList";
import "./maturaSubject.css";
import MaturaGenerator from "../MaturaGeneratorComponent/MaturaGeneratorr";
import SavedQuestions from "../../../../Components/SavedQuestionsComponent/SavedQuestions";

const MaturaSubject = ({ data, imePredmeta, razinaPredmeta }) => {
  const [isSimulationActive, setSimulationActive] = useState(false);
  const [subjetName, setSubjectName] = useState("loading... ");

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const formatRazinaPredmeta = (razina) => {
    if (razina === "visa") return "viša";
    if (razina === "niza") return "niža";
    return "";
  };

  useEffect(() => {
    const formattedImePredmeta = capitalizeFirstLetter(imePredmeta);
    const formattedRazinaPredmeta = formatRazinaPredmeta(razinaPredmeta);
    if (formattedRazinaPredmeta === "") {
      setSubjectName(formattedImePredmeta);
    } else {
      setSubjectName(formattedImePredmeta + " " + formattedRazinaPredmeta);
    }
  }, [imePredmeta,razinaPredmeta]);

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
        <h1 className="matura-subject-section-title">
          Simulacija državne mature
        </h1>
        <h2 className="matura-subject-section-subtitle">
          Ako želiš vježbati rješavanje državne mature s uvjetima koje češ imati
          na ispitu, bez prikazanih rješenja i s vremenskim ograničenjem, klikni
          tekst ispod. Nakon što si odabrao opciju simulacije državne mature
          klikni na bilo koju maturu s liste prethodnih matura ili odaberi
          opciju generiranja nove mature!!
        </h2>
        <p
          className={`matura-subject-checkbox-subtitle matura-subject-checkbox-simulation-text ${
            isSimulationActive ? "active" : ""
          }`}
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
        <h1 className="matura-subject-section-title">Spremljeni zadaci</h1>
        <h2 className="matura-subject-section-subtitle">
          U nastavku su prikazani spremljeni zadaci sa mature {subjetName}.
          Moguče je dodati boju pojedinom zadatku za lakše snalaženje. Klikni na
          boju te potom klikni na karticu zadataka.
        </h2>
        <SavedQuestions />
      </section>
    </main>
  );
};

export default MaturaSubject;
