import React from 'react'
import Loading from './Loading'

const Youtube = (props) => {
  const id = getYoutubeVideoId(props.url)

  return (
    <div className='embed-container'>
      <Loading />
      <iframe src={`https://www.youtube.com/embed/${id}`} frameBorder='0' allowFullScreen />
    </div>
  )
}

const getYoutubeVideoId = (url) => {
  const id = /watch\?v=([^&]+)/.exec(url)[1]
  return id
}

export default Youtube
