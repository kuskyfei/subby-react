
import React from 'react'

const Instagram = (props) =>

  <div className='card__white-border-1px'>
    <blockquote style={{width: '100%'}} className='instagram-media' data-instgrm-captioned data-instgrm-permalink={props.url} />
  </div>

export default Instagram
