
import React from 'react'

const Reddit = (props) =>

  <div className='card__white-border-3px'>
    <blockquote className='reddit-card'>
      <a href={props.url} />
    </blockquote>
  </div>

export default Reddit