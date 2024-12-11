import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../Components/HeaderComponent/Header";
import Navbar from "../../Components/NavbarComponent/Navbar";
import Footer from "../../Components/FooterComponent/Footer";
import NotFound from "../ErrorPages/NotFound/NotFound";
import ExamList from "./MaturaListComponents/ExamListComponent/ExamList";
import SubjectTitle from "../../Components/SubjectTitleComponent/SubjectTitle";

const MaturaList = () => {
  const { imePredmeta, razinaPredmeta } = useParams(null,null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (imePredmeta!==null && razinaPredmeta!==null) {
      const fetchData = async () => {
        try {
          var response;
          if (razinaPredmeta === null) {
            response = await fetch(`/${imePredmeta}`);
          } else {
            response = await fetch(
              `/${imePredmeta}/${razinaPredmeta}`
            );
          }
          if (!response.ok) {
            throw new Error("Greška u dohvaćanju podataka");
          }
          const result = await response.json();
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

  if (loading) {
    return <div>Učitavanje podataka...</div>;
  }

  if (error) {
    // Trebam dodati bolju stranicu za error TO Do
    return <NotFound/>;
  }

  return (
    <main>
      <Header />
      <Navbar />
      <SubjectTitle imePredmeta={imePredmeta} razinaPredmeta={razinaPredmeta}/>
      <ExamList data={data}/>
      <Footer footerImmageClass={"footer1"} />
    </main>
  );
};

export default MaturaList;
