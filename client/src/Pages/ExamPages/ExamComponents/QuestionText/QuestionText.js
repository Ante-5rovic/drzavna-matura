import React from 'react'

const QuestionText = ({ title, tekst }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{tekst}</p>
    </div>
  )
}

export default QuestionText