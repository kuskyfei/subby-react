
import React from 'react'

const Facebook = (props) => {

  console.log(props)

  const type = getType(props.url)

  console.log(type)

  return (
    <div className='card__white-border-1px'>
      <div className='embed-container'>
        <iframe src={`https://www.facebook.com/plugins/${type}.php?href=${props.url}`} scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media" allowFullScreen="true">
        </iframe>
      </div>
    </div>
  )
}

const getType = (url) => {
  let type = 'post'

  if (url.match(/\/videos\//)) {
    type = 'video'
  }

  return type
}

export default Facebook