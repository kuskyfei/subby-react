import React from 'react'
import Loading from './Loading'

const Facebook = (props) => {
  const type = getType(props.url)

  return (
    <div className='card__white-border-1px'>
      <div className='embed-container'>
        <Loading />
        <iframe src={`https://www.facebook.com/plugins/${type}.php?href=${props.url}`} scrolling='no' frameBorder='0' allow='encrypted-media' allowFullScreen='true' />
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
