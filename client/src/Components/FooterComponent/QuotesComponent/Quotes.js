import React from "react";

import "./quotes.css";

const quotes = [
  "Dobro da nisi učio vjerovatnost i statistiku, sad bi se nasekirao.",
  "Nema veze koliko si učio, uvijek će biti to jedno pitanje.",
  "Najgori dio ispita? Kada shvatiš da si naučio sve osim onoga što su te pitali.",
  "Pokušaj ne paničariti – ispit je samo papir s pitanjima. Ti si genij s olovkom.",
  "Znanje ne dolazi iz prepisivanja… ali barem dolazi prolazna ocjena!",
  "Neki ljudi donose kalkulator na ispit. Ja donosim nadu, molitve i sretnu olovku.",
  "Ako neznaš zaokruži C.",
  "May the odds ever be in your favor!",
  "Force is strong with you! Trust in it, focus, and let it guide you to success.",
  "You’ve got this, Jedi of knowledge!",
  "What doesn’t kill you makes you stronger – or at least gives you a great story to tell later!",
  "The Eye of Sauron sees it all, except you passing matura.",
  "Imaš veliku glavu, sigurno češ zanti barem nešto odgovoriti.",
  "Opusti se to je samo matura, vjerovatno naj važniji ispit koji če ti odrediti ostatak života"
];

const Quotes = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);

  return (
    <div className="quotes-main-wrap">
      <p className="quotes-context">{quotes[randomIndex]}</p>
    </div>
  );
};

export default Quotes;
