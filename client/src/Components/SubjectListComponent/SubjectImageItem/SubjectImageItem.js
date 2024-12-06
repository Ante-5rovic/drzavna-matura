import React from "react";
import { Link } from 'react-router-dom';

import './subjectImageItem.css'

const SubjectImageItem = ({ src, alt, title, link }) => {
  return (
    <div className="subject-image-item-wrap">
      <Link to={link} className="subject-image-item-link"><img src={`/Images/SubjectImages/${src}`} alt={alt} className="subject-image-item-immage"/></Link>
      <Link to={link} className="subject-image-item-link subject-image-item-title1"><h1 className="subject-image-item-title1">{title}</h1></Link>
      <Link to={link} className="subject-image-item-link subject-image-item-title2"><h1 className="subject-image-item-title2">{alt}</h1></Link>
    </div>
  );
};

export default SubjectImageItem;
