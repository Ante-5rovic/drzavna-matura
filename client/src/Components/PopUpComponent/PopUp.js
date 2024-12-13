import React from "react";
import "./popUp.css"; 

const PopUp = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>
          &times;
        </button>
        <div className="popup-message">{message}</div>
      </div>
    </div>
  );
};

export default PopUp;
