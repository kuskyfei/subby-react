import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = {
  video: {
    width: '100%',
    height: 'auto'
  }
}

const Video = (props) => {
  return (
    <video
      className={props.classes.video}
      controls
      src={props.url}
    >
      Sorry, your browser doesn't support embedded videos.
    </video>
  )
}

export default withStyles(styles)(Video)
