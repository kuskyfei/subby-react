import React from 'react'
import Loading from './Loading'
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

const Vimeo = (props) => {
  const id = getVimeoVideoId(props.url)

  return (
    <div className={props.classes.responsiveEmbed}>
      <Loading />
      <iframe src={`https://player.vimeo.com/video/${id}`} frameBorder='0' allowFullScreen />
    </div>
  )
}

const getVimeoVideoId = (url) => {
  const id = /\/([^/]+)$/.exec(url)[1]
  return id
}

export default withStyles(styles)(Vimeo)
