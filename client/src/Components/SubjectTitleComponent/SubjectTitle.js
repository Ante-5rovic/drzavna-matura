import React from "react";

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
    return <h1>Loading...</h1>;
  } else if (formattedRazinaPredmeta === "") {
    return <h1>{formattedImePredmeta}</h1>;
  } else {
    return (
      <h1>
        {formattedImePredmeta} {formattedRazinaPredmeta}
      </h1>
    );
  }
};

export default SubjectTitle;
