import React from 'react';
import { useNavigate } from 'react-router-dom';
import './question.css';
import { MdDeleteForever } from "react-icons/md";
import { FaExternalLinkSquareAlt } from "react-icons/fa";

const Question = ({ id, title, text, color, onDelete, onClick }) => {
  const navigate = useNavigate();

  const containerStyle = {
    border: `3px solid ${color || '#ddd'}`
  };

  const handleNavigate = (e) => {
    e.stopPropagation();
    navigate(`/pitanje/${id}`);
  };

  return (
    <div 
      className="question-main-wrap" 
      style={containerStyle} 
      onClick={onClick}
    >
      <div className="question-title">{title}</div>

        <MdDeleteForever
        className="question-delete-button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}/>
      

      <FaExternalLinkSquareAlt
      className="question-link-button"
      onClick={handleNavigate}
      />

      <div className="question-text">{text}</div>
    </div>
  );
};

export default Question;
