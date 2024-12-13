import React, { useContext } from "react";
import { AuthContext } from "../../Components/_OtherAppRelatedComponents/AuthContext"; //TEST!!!!

import "./home.css";

import Header from "../../Components/HeaderComponent/Header";
import Navbar from "../../Components/NavbarComponent/Navbar";
import Footer from "../../Components/FooterComponent/Footer";
import SubjectListComponent from "../../Components/SubjectListComponent/SubjectListComponent";

const Home = () => {

  const { authState } = useContext(AuthContext);
  //TESTT!!!!
  console.log(authState.email)
  console.log(authState.username)
  console.log(authState.role)



  return (
    <main className="home-main-wrap">
      <Header />
      <Navbar />
      <div className="home-article-wrap">
        <div id='home-article-first-ancor'></div>
        <article className="home-article-first-wrap home-article">
          <h1 className="home-paragraf-title">Što je Maturko?</h1>
          <p className="home-paragraf-text">
            Maturko je web platforma za pomoć učenju, pripremi i savladavanju gradiva državne mature.
            Za sada na Maturku se može pronaći online oblik ispita državne mature iz matematike A razine.
            Online matura omogućava rješavanja ispita u internetskom pregledniku, arhiviranje zadataka (ako si prijavljen), 
            simulaciju mature od 3h i generiranje nove mature kombinirajući zadatke svih prethodnih matura (ako si prijavljen).
          </p>
        </article>
        <div className="home-artivle-separator"></div>
        <div id='home-article-second-ancor'></div>
        <article className="home-article-second-wrap home-article">
          <h1 className="home-paragraf-title">Kako koristiti Maturka?</h1>
          <p className="home-paragraf-text">
            Jednostavno. Izaberi predmet kojeg želiš učiti, klikni na njega i odaberi jednu od godina državne mature.
            Nakon toga riješi ispit i pogledaj koji si rezultat ostvario. Uz mature po godinama možeš odabrati i opciju 
            simulacija mature koja uz zadatke nema prikazana rješenja i traje 3 sata, nakon isteka 3 sata možeš nastaviti rješavati matura 
            ali zadaci predani poslije toga neće se bodovati u rezultat. U slučaju da si riješio sve mature provjeri svoje znanje 
            generirajući novu maturu.  
          </p>
        </article>
        <div className="home-artivle-separator"></div>
        <div id='home-article-tird-ancor'></div>
        <article className="home-article-tird-wrap home-article">
          <h1 className="home-paragraf-title">Glavni predemti</h1>
          <SubjectListComponent subject={"glavniPredmeti"}/>
          <p className="home-paragraf-text">
           VAŽNO: za sada je inplementirana samo matematika viša razina!!!
          </p>
        </article>
        <div className="home-artivle-separator"></div>
        <div id='home-article-forth-ancor'></div>
        <article className="home-article-forth-wrap home-article">
          <h1 className="home-paragraf-title">Izborni predemti</h1>
          <SubjectListComponent subject={"izborniPredemti"}/>
          <p className="home-paragraf-text">
           VAŽNO: za sada nije inplementira niti jedan izborni predmet!!!
          </p>
        </article>
        <div className="home-artivle-separator"></div>
        <div id='home-article-fifth-ancor'></div>
        <article className="home-article-fifth-wrap home-article">
          <h1 className="home-paragraf-title">O nama</h1>
          <p className="home-paragraf-text">
            Mi smo skupina studenata Fera koja je odlučila razviti web aplikaciju za pomoć pripremi državne mature.
            Nedavno smo i sami prošli kroz isti proces kroz kojeg vi sada prolazite te pokušavamo po vlastitom iskustvu
            napravit web stranicu koja bi trebala značajno olakšati stres i pripreme za državnu maturu.
            </p>
            <p className="home-paragraf-text">
            U budućnosti plan je dodatno nadograditi stranicu, svaki prijedlog je dobrodošao.
            Svoje prijedloge možete poslati na mail koji se nalazi na dnu stranice.
          </p>
        </article>
      </div>

      <Footer footerImmageClass={"footer1"} />
    </main>
  );
};

export default Home;
