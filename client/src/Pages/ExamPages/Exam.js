import React, { useEffect, useState } from "react";
import Header from "../../Components/HeaderComponent/Header";
import Footer from "../../Components/FooterComponent/Footer";
import MaturkoText from "./ExamComponents/MaturkoText/MaturkoText";
import "./exam.css";
import { useParams, useNavigate } from "react-router-dom";
import LoadingScreen from "../../Components/LoadingScreenComponent/LoadingScreen";
import ExamQuestionWraper from "./ExamComponents/ExamQuestionWraper/ExamQuestionWraper";

const Exam = () => {
  const { imeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [examData, setExamData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const fetchPromise = (async () => {
          console.log("fetch se dogodio na frontendu");
          const response = await fetch(`/exams/${imeId}`);
          if (!response.ok) {
            throw new Error("Greška u dohvaćanju podataka");
          }
          return await response.json();
        })();

        const delayPromise = new Promise((resolve) =>
          setTimeout(resolve, 1500)
        );

        const [data] = await Promise.all([fetchPromise, delayPromise]);
        setExamData(data);

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
  }, [error, navigate]);

  useEffect(() => {
    console.log("Stanje examData je ažurirano:", examData);
  }, [examData]);

  return (
    <div className="exam-main-wrap">
      {/* Header je uvijek vidljiv */}
      <Header />

      {loading ? (
        <div className="exam-loading-screen-main-wrap exam-loading-visible">
          <LoadingScreen />
        </div>
      ) : error ? (
        <div>Došlo je do greške.</div>
      ) : (
        examData && (
          <div className="exam-content-wrap">
            <h1 className="exam-title">
              {examData.subject} {examData.term} {examData.year}
            </h1>
            <MaturkoText isSimulationActive={"bez simulacije mature"} />
            {/* ovdje treba doci komponenta za upute TODO*/}

            {examData.questions && <ExamQuestionWraper questionsData={examData.questions} />}
          </div>
        )
      )}


      <Footer footerImmageClass={"footer1"} />
    </div>
  );
};

export default Exam;
