import React, { useEffect, useState } from "react";
import ExamSubjectWrapGeneric from "./ExamSubjectWrapComponents/ExamSubjectWrapGeneric/ExamSubjectWrapGeneric";
import Header from "../../Components/HeaderComponent/Header";
import Footer from "../../Components/FooterComponent/Footer";
import MaturkoText from "./ExamComponents/MaturkoText/MaturkoText";
import "./exam.css";
import { useParams ,useNavigate } from "react-router-dom";
import LoadingScreen from "../../Components/LoadingScreenComponent/LoadingScreen";


const Exam = () => {
  const { imeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const fetchPromise = (async () => {
          //const response = await fetch(`/exam/${imeId}`);
          const response = await fetch(`/mature/hrvatski/visa`);
          if (!response.ok) {
            throw new Error("Greška u dohvaćanju podataka");
          }
          return await response.json();
        })();

        const delayPromise = new Promise((resolve) =>
          setTimeout(resolve, 1500) 
        );

        await Promise.all([fetchPromise, delayPromise]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [imeId]);

  useEffect(() => {
    if (error) {
      navigate("/error");
    }
  }, [error, navigate])

  return (
    <div className="exam-main-wrap">
      {/* Header je uvijek vidljiv */}
      <Header />

      {/* Loader - prikazuje se dok je loading = true */}
      <div
        className={`exam-loading-screen-main-wrap ${
          loading ? "exam-loading-visible" : "exam-loading-hidden"
        }`}
      >
        <LoadingScreen />
      </div>

      {/* Glavni sadržaj aplikacije - prikazuje se kada loading = false */}
      <div className="exam-content-wrap">
        <h1 className="exam-title">{imeId}</h1>
        <MaturkoText isSimulationActive={"bez simulacije mature"} />
        <ExamSubjectWrapGeneric />
      </div>

      {/* Footer je uvijek vidljiv */}
      <Footer footerImmageClass={"footer1"} />
    </div>
  );
};

export default Exam;
