import React from 'react'

const Youtube = (props) => {
  const id = getYoutubeVideoId(props.url)

  return (
    <div className='embed-container'>
      <iframe src={`https://www.youtube.com/embed/${id}`} frameborder='0' allowfullscreen />
    </div>
  )
}

const getYoutubeVideoId = (url) => {
  const id = /watch\?v=(.+)/.exec(url)[1]
  return id
}

export default Youtube
