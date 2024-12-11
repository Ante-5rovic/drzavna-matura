import React from "react";
import "./subjectListComponent.css";
import SubjectImageItem from "./SubjectImageItem/SubjectImageItem";

const glavniPredmeti = [
  {
    src: "eng-A.svg",
    alt: "Eng-A",
    title: "Engleski-A",
    link: "/matura/engleski/visa",
  },
  {
    src: "mat-A.svg",
    alt: "Mat-A",
    title: "Matematika-A",
    link: "/matura/matematika/visa",
  },
  {
    src: "hrv-A.svg",
    alt: "Hrv-A",
    title: "Hrvatski-A",
    link: "/matura/hrvatski/visa",
  },
  {
    src: "eng-B.svg",
    alt: "Eng-B",
    title: "Engleski-B",
    link: "/matura/engleski/niza",
  },
  {
    src: "mat-B.svg",
    alt: "Mat-B",
    title: "Matematika-B",
    link: "/matura/matematika/niza",
  },
  {
    src: "hrv-B.svg",
    alt: "Hrv-B",
    title: "Hrvatski-B",
    link: "/matura/hrvatski/niza",
  },
];
const izborniPredemti = [
  {
    src: "filozofija.svg",
    alt: "Filozofija",
    title: "Filozofija",
    link: "/StillInDevelopment#still-in-development-top-ancor",
  },
  { src: "fizika.svg", alt: "Fizika", title: "Fizika", link: "/fizika#still-in-development-top-ancor" },
  {
    src: "psihologija.svg",
    alt: "Psihologija",
    title: "Psihologija",
    link: "/StillInDevelopment#still-in-development-top-ancor",
  },
  {
    src: "biologija.svg",
    alt: "Biologija",
    title: "Biologija",
    link: "/StillInDevelopment#still-in-development-top-ancor",
  },
  {
    src: "kemija.svg",
    alt: "Kemija",
    title: "Kemija",
    link: "/StillInDevelopment#still-in-development-top-ancor",
  },
  {
    src: "likovni.svg",
    alt: "Likovni",
    title: "Likovni",
    link: "/StillInDevelopment#still-in-development-top-ancor",
  },
  {
    src: "logika.svg",
    alt: "Logika",
    title: "Logika",
    link: "/StillInDevelopment#still-in-development-top-ancor",
  },
  {
    src: "informatika.svg",
    alt: "Informatika",
    title: "Informatika",
    link: "/StillInDevelopment#still-in-development-top-ancor",
  },
  {
    src: "geografija.svg",
    alt: "Geografija",
    title: "Geografija",
    link: "/StillInDevelopment#still-in-development-top-ancor",
  },
  { src: "pig.svg", alt: "PIG", title: "Politika i gospodarstvo", link: "/StillInDevelopment#still-in-development-top-ancor" },
];

const SubjectListComponent = ({subject}) => {
    if(subject==="izborniPredemti"){
        return (
            <div className="subject-list-component-wrap">
              {izborniPredemti.map((image, index) => (
                <SubjectImageItem
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  title={image.title}
                  link={image.link}
                />
              ))}
            </div>
          );

    }else if(subject==="glavniPredmeti"){
        return (
            <div className="subject-list-component-wrap">
              {glavniPredmeti.map((image, index) => (
                <SubjectImageItem
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  title={image.title}
                  link={image.link}
                />
              ))}
            </div>
          );

    }else{
        <div>Error</div>
    }
  
};

export default SubjectListComponent;
