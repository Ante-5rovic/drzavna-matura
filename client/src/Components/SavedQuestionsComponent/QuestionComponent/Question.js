import React from 'react';
import { useNavigate } from 'react-router-dom'; // React Router
import './question.css';
import { MdDeleteForever } from "react-icons/md";
import { FaExternalLinkSquareAlt } from "react-icons/fa";

const Question = ({ id, title, text, color, onDelete, onClick }) => {
  const navigate = useNavigate();

  // Stil za kontejner
  const containerStyle = {
    border: `3px solid ${color || '#ddd'}`
  };

  const handleNavigate = (e) => {
    e.stopPropagation(); // da se ne okine onClick kontejnera
    navigate(`/pitanje/${id}`);
  };

  return (
    <div 
      className="question-main-wrap" 
      style={containerStyle} 
      onClick={onClick}
    >
      <div className="question-title">{title}</div>

      {/* Gumb za brisanje (X) - gornji desni kut */}

        <MdDeleteForever
        className="question-delete-button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}/>
      

      {/* Gumb za otvaranje (Otvori) - odmah ispod X gumba */}
      <FaExternalLinkSquareAlt
      className="question-link-button"
      onClick={handleNavigate}
      />

      <div className="question-text">{text}</div>
    </div>
  );
};

export default Question;
