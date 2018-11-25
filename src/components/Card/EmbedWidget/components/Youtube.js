import React from 'react'
import {LoadingIframe} from './util'
import withStyles from '@material-ui/core/styles/withStyles'

const responsiveEmbedStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
}

const styles = {
  responsiveEmbed: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    overflow: 'hidden',
    maxWidth: '100%',
    '& iframe': responsiveEmbedStyles,
    '& object': responsiveEmbedStyles,
    '& embed': responsiveEmbedStyles
  }
}

const Youtube = (props) => {
  const id = getYoutubeVideoId(props.url)

  return (
    <div className={props.classes.responsiveEmbed}>
      <LoadingIframe />
      <iframe src={`https://www.youtube.com/embed/${id}`} frameBorder='0' allowFullScreen />
    </div>
  )
}

const getYoutubeVideoId = (url) => {
  try {
    const id = /watch\?v=([^&]+)/.exec(url)[1]
    return id
  } catch (e) {}
}

export default withStyles(styles)(Youtube)
