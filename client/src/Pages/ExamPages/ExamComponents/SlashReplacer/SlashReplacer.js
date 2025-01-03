import React from 'react'

const SlashReplacer = ({ text }) => {
    const lines = text.split('\n');

    return (
      <div>
        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    );
}

export default SlashReplacer