import React from 'react'
import SlashReplacer from '../SlashReplacer/SlashReplacer'
import './directionText.css'

const DirectionText = ({ upute }) => {
  return (
    <section className='direction-text-main-wrap'>
      {upute.map((uputa) => (
        <div key={uputa.id} className='direction-text-segment'>
          <h2 className='direction-text-title'>{uputa.naziv}</h2>
          <div className='direction-text-subtitle'><SlashReplacer text={uputa.sadrzaj}/></div>
        </div>
      ))}
    </section>
  )
}

export default DirectionText
