import React from "react";
import './subjectTitle.css'

const SubjectTitle = ({ imePredmeta, razinaPredmeta }) => {
  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const formatRazinaPredmeta = (razina) => {
    if (razina === "visa") return "viša";
    if (razina === "niza") return "niža";
    return "";
  };

  const formattedImePredmeta = capitalizeFirstLetter(imePredmeta);
  const formattedRazinaPredmeta = formatRazinaPredmeta(razinaPredmeta);

  if (formattedImePredmeta === "") {
    return <h1 className="subject-title-main-wrap">Loading...</h1>;
  } else if (formattedRazinaPredmeta === "") {
    return <h1 className="subject-title-main-wrap">{formattedImePredmeta}</h1>;
  } else {
    return (
      <h1 className="subject-title-main-wrap">
        {formattedImePredmeta} {formattedRazinaPredmeta}
      </h1>
    );
  }
};

export default SubjectTitle;
