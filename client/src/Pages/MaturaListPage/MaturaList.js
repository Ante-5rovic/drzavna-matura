import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../Components/HeaderComponent/Header";
import Navbar from "../../Components/NavbarComponent/Navbar";
import Footer from "../../Components/FooterComponent/Footer";
import NotFound from "../ErrorPages/NotFound/NotFound";
import SubjectTitle from "../../Components/SubjectTitleComponent/SubjectTitle";
import LoadingScreen from "../../Components/LoadingScreenComponent/LoadingScreen";
import "./maturaList.css";
import MaturaSubject from "./MaturaListComponents/MaturaSubjectComponent/MaturaSubject";

const MaturaList = () => {
  const { imePredmeta, razinaPredmeta } = useParams(null, null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imePredmetaTitle, setImePredmetaTitle] = useState("");
  const [razinaPredmetaTitle, setRazinaPredmetaTitle] = useState("");

  useEffect(() => {
    setLoading(true);
    if (imePredmeta !== null && razinaPredmeta !== null) {
      console.log(imePredmeta + " " + razinaPredmeta)
      const fetchData = async () => {
        try {
          const fetchPromise = (async () => {
            var response;
            if (razinaPredmeta === null) {
              response = await fetch(`/mature/${imePredmeta}`);
            } else {
              response = await fetch(`/mature/${imePredmeta}/${razinaPredmeta}`);
            }
            if (!response.ok) {
              throw new Error("Greška u dohvaćanju podataka");
            }
            return await response.json();
          })();

          const delayPromise = new Promise(
            (resolve) => setTimeout(resolve, 1500) // 10 sekundi
          );

          const [result] = await Promise.all([fetchPromise, delayPromise]);
          setImePredmetaTitle(imePredmeta);
          setRazinaPredmetaTitle(razinaPredmeta);
          setData(result);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [imePredmeta, razinaPredmeta]);

  if (error) {
    // Trebam dodati bolju stranicu za error TO Do
    return <NotFound />;
  }

  return (
    <div>
      <Header />
      <Navbar />
      <main className="matura-list-main-wrap">
        <div
          className={`matura-list-loading-screen-main-wrap ${
            loading ? "matura-list-loading-visible" : "matura-list-loading-hidden"
          }`}
        >
          <LoadingScreen />
        </div>
        <div
          className={`matura-list-content-wrap ${
            loading ? "matura-list-content-hidden" : "matura-list-content-visible"
          }`}
        >
          <SubjectTitle
            imePredmeta={imePredmetaTitle}
            razinaPredmeta={razinaPredmetaTitle}
          />
          <MaturaSubject data={data} imePredmeta={imePredmeta} razinaPredmeta={razinaPredmetaTitle}/>
          
        </div>
      </main>
      <Footer footerImmageClass={"footer1"} />
    </div>
  );
};

export default MaturaList;
