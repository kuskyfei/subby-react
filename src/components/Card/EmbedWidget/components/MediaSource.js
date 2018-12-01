import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = {
  video: {
    width: '100%',
    height: 'auto'
  },
  audio: {
    width: '100%'
  }
}

const MediaSource = (props) => {
  const {url} = props
  const {src, play, pause, type} = url

  if (type === 'audio') {
    return (
      <audio
        className={props.classes.audio}
        controls
        src={src}
        onPlay={play}
        onPause={pause}
      >
        Sorry, your browser doesn't support embedded audios.
      </audio>
    )
  }

  return (
    <video
      className={props.classes.video}
      controls
      src={src}
      onPlay={play}
      onPause={pause}
    >
      Sorry, your browser doesn't support embedded videos.
    </video>
  )
}

export default withStyles(styles)(MediaSource)
