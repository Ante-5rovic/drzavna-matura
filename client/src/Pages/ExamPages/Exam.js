import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ExamSubjectWrapGeneric from './ExamSubjectWrapComponents/ExamSubjectWrapGeneric/ExamSubjectWrapGeneric'
import Header from '../../Components/HeaderComponent/Header'
import Footer from '../../Components/FooterComponent/Footer'
import MaturkoText from './ExamComponents/MaturkoText/MaturkoText'
import LoadingScreen from "../../Components/LoadingScreenComponent/LoadingScreen"
import './exam.css'

const Exam = () => {
  const { imeId } = useParams();

  // Dodano stanje za podatke
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        // Dohvat podataka
        const fetchPromise = (async () => {
          const response = await fetch(`/mature/hrvatski/visa`);//Fejk fatch!!!! popravi
          if (!response.ok) {
            throw new Error("Greška u dohvaćanju podataka");
          }
          return await response.json();
        })();

        // Umjetno kašnjenje od 1.5 sekunde (ako želiš simulirati loading)
        const delayPromise = new Promise(
          (resolve) => setTimeout(resolve, 1500)
        );

        // Čekamo obje radnje - dohvat i kašnjenje
        const [result] = await Promise.all([fetchPromise, delayPromise]);

        // Spremamo podatke u stanje
        setExamData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [imeId]);

  // Ako je još uvijek loading, prikazujemo loading screen
  if (loading) {
    return (
      <div className='exam-main-wrap'>
        <Header />
        <LoadingScreen />
        <Footer footerImmageClass={"footer1"} />
      </div>
    )
  }

  // Ako se dogodila greška, prikažemo poruku o grešci
  if (error) {
    return (
      <div className='exam-main-wrap'>
        <Header />
        <p>Došlo je do greške: {error}</p>
        <Footer footerImmageClass={"footer1"} />
      </div>
    )
  }

  // Kad nije ni loading ni greška, prikazujemo normalan sadržaj
  return (
    <div className='exam-main-wrap'>
      <Header />
      <h1 className='exam-title'>{imeId}</h1>
      <MaturkoText isSimulationActive={"bez simulacije mature"} />
      {/* Prosljeđujemo dohvaćene podatke u podkomponentu, ako je potrebno */}
      <ExamSubjectWrapGeneric examData={examData} />
      <Footer footerImmageClass={"footer1"} />
    </div>
  )
}

export default Exam
