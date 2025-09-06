// src/utils/textParser.js

/**
 * Parsira tekstualni niz koji sadrži običan tekst i LaTeX formule (omeđene s '$').
 * @param {string} text - Ulazni tekst za parsiranje.
 * @returns {Array<{type: 'text' | 'math', value: string}>} Niz objekata,
 * gdje svaki objekt predstavlja ili običan tekst ili matematičku formulu.
 */
export const parseQuestionText = (rawText) => {
  // Ako je tekst prazan ili ga nema, vrati prazan niz
  if (!rawText) {
    return [];
  }

  // =======================================================================
  //  KORAK ČIŠĆENJA - OVO JE RJEŠENJE PROBLEMA
  // =======================================================================
  const cleanedText = rawText
    // 1. Zamijeni višestruke kose crte jednom. Ovo rješava '\\sqrt' -> '\sqrt'
    .replace(/\\+/g, "\\")
    // 2. Ukloni čudne "form-feed" znakove (ako postoje od lošeg copy-pastea)
    .replace(/\f/g, "")

    // Možeš dodati još .replace() pravila ako uočiš druge nepravilnosti.
    // =======================================================================

  // Regularni izraz koji pronalazi sve što je između '$' znakova.
  const regex = /(\$.*?\$)/;

  // Nastavljamo s očišćenim tekstom
  const parts = cleanedText.split(regex);

  // Mapiramo kroz dijelove i stvaramo strukturirani niz objekata
  return parts
    .filter((part) => part) // Uklanjamo moguće prazne stringove iz niza
    .map((part) => {
      // Provjeravamo je li dio niza matematička formula
      if (part.startsWith("$") && part.endsWith("$")) {
        return {
          type: "math",
          // Uklanjamo '$' s početka i kraja
          value: part.slice(1, -1),
        };
      } else {
        // Ako nije, onda je običan tekst
        return {
          type: "text",
          value: part,
        };
      }
    });
};
