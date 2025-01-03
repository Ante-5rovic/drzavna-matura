import React from 'react'
import DirectionText from '../../ExamComponents/DirectionsText/DirectionText'
import QuestionText from '../../ExamComponents/QuestionText/QuestionText'
import QuestionGenericABCD from '../../ExamComponents/QuestionGenericABCD/QuestionGenericABCD'
import "./examSubjectWrapGeneric.css"
const examData = {
  drzavnaMaturaHrvatski: {
    // ...ostali podaci iz JSON-a
    upute: [
      {
        "id": 2,
        "tip": "upute",
        "naziv": "OPĆE UPUTE",
        "sadrzaj": "Pozorno pročitajte sve upute i slijedite ih.\nNe okrećite stranicu i ne rješavajte zadatke dok to ne odobri voditelj ispitne prostorije.\nNalijepite identifikacijske naljepnice na sve ispitne materijale koje ste dobili u sigurnosnoj vrećici.\nIspit traje 100 minuta.\nIspred svake skupine zadataka uputa je za rješavanje. Pozorno je pročitajte.\nMožete pisati po stranicama ove ispitne knjižice, ali odgovore morate označiti znakom X\nna listu za odgovore.\nNa 2. stranici ove ispitne knjižice prikazan je način označavanja odgovora i način ispravljanja\npogrešaka. Pri ispravljanju pogrešaka potrebno je staviti paraf (isključivo skraćeni potpis,\na ne puno ime i prezime).\nUpotrebljavajte isključivo kemijsku olovku kojom se piše plavo"

      },
      {
        "id": 3,
        "tip": "upute",
        "naziv": "Čitanje I",
        "sadrzaj": "Zadatci s polaznim tekstom\nZadatci višestrukoga izbora\nU zadatcima višestrukoga izbora od više ponuđenih odgovora samo je jedan točan.\nTočan odgovor morate označiti znakom X na listu za odgovore.\nTočan odgovor donosi jedan bod.\nZadatci od 1. do 30. odnose se na polazne tekstove."
      }
    ]
  }
}

const ExamSubjectWrapGeneric = () => {
  return (
    <div className='exam-subject-wrap-generic-main-wrap'>
        <DirectionText upute={examData.drzavnaMaturaHrvatski.upute} />
        <QuestionText/>
        <QuestionGenericABCD/>
    </div>
  )
}

export default ExamSubjectWrapGeneric