
import React from 'react'

const Vimeo = (props) => {

  const id = getVimeoVideoId(props.url)

  return (
    <div className='embed-container'>
      <iframe src='https://player.vimeo.com/video/257056050' frameborder='0' allowfullscreen>
      </iframe>
    </div>
  )
}

const getVimeoVideoId = (url) => {
  const id = /\/([^\/]+)$/.exec(url)[1]
  return id
}

export default Vimeo