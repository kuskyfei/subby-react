
import React from 'react'

const Vimeo = (props) => {
  const id = getVimeoVideoId(props.url)

  return (
    <div className='embed-container'>
      <iframe src={`https://player.vimeo.com/video/${id}`} frameborder='0' allowfullscreen />
    </div>
  )
}

const getVimeoVideoId = (url) => {
  const id = /\/([^/]+)$/.exec(url)[1]
  return id
}

export default Vimeo
