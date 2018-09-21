import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = {
  audio: {
    width: '100%'
  }
}

const Audio = (props) => {
  return (
    <audio
      className={props.classes.audio}
      controls
      src={props.url}
    >
      Sorry, your browser doesn't support embedded audios.
    </audio>
  )
}

export default withStyles(styles)(Audio)
