import React from "react";
import "./subjectListComponent.css";
import SubjectImageItem from "./SubjectImageItem/SubjectImageItem";

const glavniPredmeti = [
  {
    src: "eng-A.svg",
    alt: "Eng-A",
    title: "Engleski-A",
    link: "/StillInDevelopment",
  },
  {
    src: "mat-A.svg",
    alt: "Mat-A",
    title: "Matematika-A",
    link: "/StillInDevelopment",
  },
  {
    src: "hrv-A.svg",
    alt: "Hrv-A",
    title: "Hrvatski-A",
    link: "/StillInDevelopment",
  },
  {
    src: "eng-B.svg",
    alt: "Eng-B",
    title: "Engleski-B",
    link: "/StillInDevelopment",
  },
  {
    src: "mat-B.svg",
    alt: "Mat-B",
    title: "Matematika-B",
    link: "/StillInDevelopment",
  },
  {
    src: "hrv-B.svg",
    alt: "Hrv-B",
    title: "Hrvatski-B",
    link: "/StillInDevelopment",
  },
];
const izborniPredemti = [
  {
    src: "filozofija.svg",
    alt: "Filozofija",
    title: "Filozofija",
    link: "/StillInDevelopment",
  },
  { src: "fizika.svg", alt: "Fizika", title: "Fizika", link: "/fizika" },
  {
    src: "psihologija.svg",
    alt: "Psihologija",
    title: "Psihologija",
    link: "/StillInDevelopment",
  },
  {
    src: "biologija.svg",
    alt: "Biologija",
    title: "Biologija",
    link: "/StillInDevelopment",
  },
  {
    src: "kemija.svg",
    alt: "Kemija",
    title: "Kemija",
    link: "/StillInDevelopment",
  },
  {
    src: "likovni.svg",
    alt: "Likovni",
    title: "Likovni",
    link: "/StillInDevelopment",
  },
  {
    src: "logika.svg",
    alt: "Logika",
    title: "Logika",
    link: "/StillInDevelopment",
  },
  {
    src: "informatika.svg",
    alt: "Informatika",
    title: "Informatika",
    link: "/StillInDevelopment",
  },
  {
    src: "geografija.svg",
    alt: "Geografija",
    title: "Geografija",
    link: "/StillInDevelopment",
  },
  { src: "pig.svg", alt: "PIG", title: "Politika i gospodarstvo", link: "/StillInDevelopment" },
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
