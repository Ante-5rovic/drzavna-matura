import React, { useState, useEffect } from "react";
import DirectionText from "../../ExamComponents/DirectionsText/DirectionText";
import QuestionText from "../../ExamComponents/QuestionText/QuestionText";
import QuestionGenericABCD from "../../ExamComponents/QuestionGenericABCD/QuestionGenericABCD";
import "./examSubjectWrapGeneric.css";

// Ovo su demo podaci:
const examData = {
  drzavnaMaturaHrvatski: {
    upute: [
      {
        id: 2,
        tip: "upute",
        naziv: "OPĆE UPUTE",
        sadrzaj:
          "Pozorno pročitajte sve upute i slijedite ih.\nNe okrećite stranicu i ne rješavajte zadatke dok to ne odobri voditelj ispitne prostorije.\nNalijepite identifikacijske naljepnice na sve ispitne materijale koje ste dobili u sigurnosnoj vrećici.\nIspit traje 100 minuta.\nIspred svake skupine zadataka uputa je za rješavanje. Pozorno je pročitajte.\nMožete pisati po stranicama ove ispitne knjižice, ali odgovore morate označiti znakom X\nna listu za odgovore.\nNa 2. stranici ove ispitne knjižice prikazan je način označavanja odgovora i način ispravljanja\npogrešaka. Pri ispravljanju pogrešaka potrebno je staviti paraf (isključivo skraćeni potpis,\na ne puno ime i prezime).\nUpotrebljavajte isključivo kemijsku olovku kojom se piše plavo",
      },
      {
        id: 3,
        tip: "upute",
        naziv: "Čitanje I",
        sadrzaj:
          "Zadatci s polaznim tekstom\nZadatci višestrukoga izbora\nU zadatcima višestrukoga izbora od više ponuđenih odgovora samo je jedan točan.\nTočan odgovor morate označiti znakom X na listu za odgovore.\nTočan odgovor donosi jedan bod.\nZadatci od 1. do 30. odnose se na polazne tekstove.",
      },
    ],
    cjelineZaCitanje: [
      {
        id: 1,
        title: "Polazni tekst – August Šenoa, Prijan Lovro",
        tekst:
          "Lovro je dakako od svega toga malo razumio. Znao je da ide u velik grad kumu. I veselilo ga. Al\nkad je vidio kako je iz majčinih očiju udarila kiša, svilo mu se oko srca pa udri i on plakati. Nu otac\notkinu sinka od majčine grudi te povede Lovru kumu zvonaru.\n\nTu je dakako drukče bilo. Kad je Lovro vidio velike kuće, silu ljudi, visoke tornjeve, kad su mu\nprvi put zagrmile velike orgulje, razigra mu se mlado srce preko reda. Nije se Lovro plašio kao\ndrugi seoski dječaci. Hitra mu pamet primila se brzo svega. Dadoše mu i knjige. Eto veselja. Po vas\ndan sjedio maličak u školi, samo večerom zvonio bi mjesto kuma „Zdravomarijuˮ. Ne bijaše mu to\ndužnost, to bijaše njegovo pravo kojim se je ponosio.\n\nUz glasove zvonova, razlijegajućih se u daleki svijet, kanda se okrilio Lovrin duh prezajući sve\ndalje i dalje. Za ono doba dočepala bi se slave školske samo gospodska djeca; ta kako da ne budu\npametna, dobra, kad su gospodska, mišljahu učitelji. Seljačko bokče1, ne znajući ni zapeti njemački,\nmoralo se stisnuti u kut ma i kako pametno bilo. I Lovro bijaše takvo bokče, al se on nije dao. Mali\ntaj bokčić oborio oštrim umom, zrelim i smjelim sudom utoliko predsude svoga doba da mu se\nučitelji čuđahu, gospodska djeca klanjahu, da, neki učitelj reče o njem: „Nad glavom toga dječarca\nsjaji vatreni jezik Svetoga Duha.ˮ Svaki zavod ima đaka koji se i poslije spominju kao neobičan\npojav. Takov bijaše i Lovro. Nu dosta o tom đakovanju. Svršiv srednje škole, znao je Lovro više\nnego većina njegovih učitelja, pa ako je nekad majčica mu mislila da će joj sin dočekati župničku\nslavu, tvrdili su sad i pismeni ljudi da će jamačno postati mladim kanonikom. Dođe hora da se\nLovro zapopi. Srce ne kucaše mu veselo; žarkomu srcu mladića bijaše i svijet preuzan, prezalo\nono preletit preko svijeta, više svijeta, a ovamo ustadoše kidat ga od svijeta, zatvorit ga u sebe.\nIma duša mirnih krotkih, pobožnih u kojih je snage da metnu sav svoj život na oltar božji, a da ne\npožale nikada žrtve. Al ne bijaše Lovro tolik junak. U njem je sve kipilo, vrilo, plamtilo. Bijaše preslab\nda si sam slomi krila. A ipak se dao zapopiti. Navukoše mu crnu halju, obrijaše tjeme. Neizmjerna\nžalost osvoji mu srce. Pamet bludila mu u sumraku. Crna haljina činjaše mu se oklopom orijaša na\nprsima patuljka. Al junački sprezao on svoje jade, zakopao ih na dnu srca svoga. Nu ne bijaše to\njunačtvo oduševljena ratnika koj plamnim srcem srće u boj; bijaše to nijema odvažnost vojnika koj,\n1 pretvori mi ovo u string",
      },
      {
        id: 2,
        title: "Zadaci uz tekst: August Šenoa, Prijan Lovro",
        zadaci: [
          {
            brojZadatka: 1,
            pitanje: "Kako je dolazak u grad utjecao na Lovru?",
            ponudeniOdgovori: {
              A: "Stvorio mu je osjećaj manje vrijednosti.",
              B: "Ispunio ga je čežnjom za domom.",
              C: "Djelovao je poticajno na njega.",
              D: "Izazvao je u njemu strah.",
            },
          },
          {
            brojZadatka: 2,
            pitanje: "Koju je predrasudu Lovro opovrgnuo?",
            ponudeniOdgovori: {
              A: "Upotreba njemačkoga jezika znak je obrazovanosti svakoga pojedinca.",
              B: "Gospodska djeca pametnija su i sposobnija od seoske djece.",
              C: "Uspješna su djeca ona koja poslušaju savjete svojih učitelja.",
              D: "Odluku o školovanju djeteta donosi otac.",
            },
          },
        ],
      },
      {
        id: 3,
        title: "Polazni tekst – Fjodor Mihajlovič Dostojevski, Zločin i kazna",
        tekst: `Fjodor Mihajlovič Dostojevski, Zločin i kazna
Međutim, ovoga puta, bojazan od susreta sa svojom vjerovnicom prenerazi čak i njega samoga
kad je izišao na ulicu.
„Na ovakvo se djelo hoću odvažiti, a ovamo se bojim takvih sitnica!ˮ pomisli on čudno se
smiješeći. „Hm!... da... sve je u rukama čovjeka, a uvijek mu izmakne ispred nosa jedino zbog
plašljivosti... takav je već aksiom1... Zanimljivo je čega se ljudi najviše boje? Novoga koraka, nove
svoje riječi boje se oni najviše... Uostalom, ja brbljam previše. Zato i ne radim ništa jer brbljam. Ali
je možda i ovako: zato brbljam jer ništa ne radim. Naučio sam se brbljati za ovih posljednjih dana,
ležeći dane i noći u kutu i premišljajući... o tricama i kučinama. Onda, zašto ja sada idem? Zar sam
ja sposoban za to? Zar je to ozbiljno? (...)ˮ
Na ulici je bila strašna žega, a uz to i zapara, tišina, posvuda vapno, skele, opeke, prašina i onaj
osobiti ljetni smrad, tako poznat svakom Peterburžaninu koji nije kadar unajmiti ljetnikovac – sve
je to u jedan mah potreslo u mladiću i onako već rastrojene živce. Oduran zadah iz krčama, kojih
baš u ovom dijelu grada ima sva sila, i pijanci koje je svaki čas sretao, iako bijaše radno vrijeme,
dopunjavali su gadan i tužan kolorit slike. Osjećaj strašnog gađenja pojavi se na trenutak na finim
mladićevim crtama. Uzgred budi rečeno, on bijaše osobito lijep, krasnih tamnih očiju, tamnoplave
kose, viši od srednjeg rasta, vitak i stasit. Ali ubrzo zapadne u duboku zamišljenost, gotovo kao u
neku otupjelost, te je hodao ne primjećujući ništa oko sebe, a i ne želeći išta primjećivati. (...)
Tako je bijedno bio odjeven da bi se drugi čovjek, čak i naviknut, ustručavao po bijelu danu izlaziti
na ulicu u takvim dronjcima. (...) Ali u mladićevoj se duši nagomilalo već toliko zlobna prezira da
se on, uza svu svoju, gdjekad jaku, mladu osjetljivost, nije na ulici ni najmanje stidio svojih prnja.
Drugačije je bilo kad se sretne s kojim znancem ili s prijašnjim drugovima, s kojima se uopće nije
volio sretati... Ali kad su taj čas, bogzna zašto i kamo, provezli ulicom pijanca u ogromnim taljigama2,
u koje je bio upregnut golem teretni konj, i pijanac mu na prolasku iznenada doviknu: „Ej ti, njemački
klobučaru,ˮ i razderao se u sav glas pokazujući na njega rukom – mladić naglo zastane i grčevito
zgrabi svoj šešir. Bio je to visok, okrugao Cimermanov šešir, ali već posve iznošen, olinjao, izrupčan
i izmrljan, bez oboda i sasvim nepodobno naheren. Ali ga nije prožimao stid, nego sasvim drugi
osjećaj, nalik na zaplašenost.
– Ja sam to i znao! – šaptao je zbunjen. – Tako sam i mislio! To je najgadnije! Evo ovakva
nekakva glupost, ma kakva tričava sitnica može pokvariti cijelu zamisao! Jest, suviše je upadljiv
šešir... Smiješan pa zato i upadljiv... Uz moje dronjke treba svakako kapa, kakva god plosnata
pogača, a ne ova nakaza. Nitko ne nosi ovakav šešir, primijetit će me na vrstu3 daleko i zapamtiti...
glavno, zapamtit će onda, i eto dokaza. Treba tu biti što neupadljiviji...`,
      },
      {
        id: 4,
        title: "Zadaci uz tekst: Fjodor Mihajlovič Dostojevski, Zločin i kazna",
        zadaci: [
          {
            brojZadatka: 6,
            pitanje: "Na što se iz djela u cjelini odnosi zamjenica to...?",
            ponudeniOdgovori: {
              A: "na pisanje pisma...",
              B: "na pisanje članka...",
              C: "na plaćanje sprovoda...",
              D: "na ubojstvo stare lihvarice",
            },
          },
        ],
      },
    ],
  },
};

const ExamSubjectWrapGeneric = () => {
  const { upute, cjelineZaCitanje } = examData.drzavnaMaturaHrvatski;

  // Ovdje čuvamo podatke o odgovorima.
  // Ključevi će biti brojZadatka (npr. 1, 2, 6...), a vrijednosti 'A', 'B', 'C', 'D' ili undefined
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Primjer: prilikom mountanja (prvi render) možemo inicijalizirati strukturu
  // tako da za SVAKI zadatak postavimo undefined (ili null).
  // Nije obavezno ako ćemo raditi "on the fly", ali evo primjera.
  useEffect(() => {
    // Pronađemo sve zadatke u cijelom JSON-u
    let initialAnswers = {};
    cjelineZaCitanje.forEach((cjelina) => {
      if (cjelina.zadaci) {
        cjelina.zadaci.forEach((zadatak) => {
          initialAnswers[zadatak.brojZadatka] = undefined; 
          // ili null, po želji
        });
      }
    });
    setSelectedAnswers(initialAnswers);
  }, [cjelineZaCitanje]);

  // Funkcija koju prosljeđujemo svakoj <QuestionGenericABCD> komponenti
  const handleSelectAnswer = (brojZadatka, answerLetter) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [brojZadatka]: answerLetter,
    }));
  };

  return (
    <div className="exam-subject-wrap-generic-main-wrap">
      {/* 1) Prikaz uputa */}
      <DirectionText upute={upute} />

      {/* 2) Prikaz cjelina (tekstovi i zadaci) */}
      {cjelineZaCitanje.map((cjelina) => (
        <div key={cjelina.id} style={{ marginBottom: "2rem" }}>
          {/* Ako postoji tekst: */}
          {cjelina.tekst && (
            <QuestionText title={cjelina.title} tekst={cjelina.tekst} />
          )}

          {/* Ako postoje zadaci: */}
          {cjelina.zadaci && (
            <div>
              <h2>{cjelina.title}</h2>

              {cjelina.zadaci.map((zadatak) => {
                // Dohvati iz stanja info o tome koji je odgovor (ako postoji) označen za ovaj zadatak
                const currentlySelected = selectedAnswers[zadatak.brojZadatka];

                return (
                  <QuestionGenericABCD
                    key={zadatak.brojZadatka}
                    zadatak={zadatak}
                    // Prosljeđujemo koji je odgovor trenutno odabran
                    selectedAnswer={currentlySelected}
                    // Callback koji se zove kad korisnik odabere odgovor
                    onSelectAnswer={handleSelectAnswer}
                  />
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExamSubjectWrapGeneric;
