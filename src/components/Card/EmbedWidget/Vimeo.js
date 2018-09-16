import React from 'react'
import Loading from './Loading'

const Vimeo = (props) => {
  const id = getVimeoVideoId(props.url)

  return (
    <div className='embed-container'>
      <Loading />
      <iframe src={`https://player.vimeo.com/video/${id}`} frameBorder='0' allowFullScreen />
    </div>
  )
}

const getVimeoVideoId = (url) => {
  const id = /\/([^/]+)$/.exec(url)[1]
  return id
}

export default Vimeo
