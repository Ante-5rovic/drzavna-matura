import React from "react";
import "./maturkoText.css";

const MaturkoText = ({isSimulationActive}) => {
  return (
    <section className="maturko-text-main-wrap">
      <h1 className="maturko-text-title">Maturko upute</h1>
      <p className="maturko-text-subtitle">
        U nastavku je prikazana državna matura. Ispit sadrži neke dodatne
        informacije koje će biti prisutne na maturi. Iako one nemaju izravnu
        funkciju za rješavanje online mature, ostavljene su kako biste se lakše
        i bolje upoznali s državnom maturom. Trenutno se nalazite u načinu rada{" "} 
        <strong>{isSimulationActive}</strong>.
        <br />
        <br />
        <strong>Simulacija mature:</strong> pitanja nemaju mogućnost pregleda
        točnog odgovora. Vremensko ograničenje za rješavanje ispita jednako je
        onome na državnoj maturi. To je prikladno za završne pripreme i
        testiranje znanja!
        <br />
        <br />
        <strong>Bez simulacije mature:</strong> u bilo kojem trenutku moguće je
        pogledati točan odgovor za pojedini zadatak. Prikladno za vježbanje
        gradiva!
        <br />
        <br />
        U oba načina rada moguće je spremiti zadatak klikom na ikonu srca u
        desnom kutu pojedinog zadatka. Zadatak koji je spremljen bit će vidljiv
        na stranici predmeta kojemu taj zadatak pripada. Svi spremljeni zadaci
        bit će vidljivi na stranici profila.
        <br />
        <br />
        Sretno s rješavanjem!!!
      </p>
    </section>
  );
};

export default MaturkoText;
