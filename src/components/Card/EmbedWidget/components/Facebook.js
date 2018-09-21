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
  whiteBorder: {
    position: 'relative',
    '&::before': {
      content: `' '`,
      display: 'block',
      border: '1px solid white',
      height: '100%',
      width: '100%',
      position: 'absolute',
      zIndex: 1,
      pointerEvents: 'none'
    }
  },

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

const Facebook = (props) => {
  const type = getType(props.url)

  return (
    <div className={props.classes.whiteBorder}>
      <div className={props.classes.responsiveEmbed}>
        <Loading />
        <iframe src={`https://www.facebook.com/plugins/${type}.php?href=${props.url}`} scrolling='no' frameBorder='0' allow='encrypted-media' allowFullScreen='true' />
      </div>
    </div>
  )
}

const getType = (url) => {
  let type = 'post'

  if (url.match(/\/videos\//)) {
    type = 'video'
  }

  return type
}

export default withStyles(styles)(Facebook)
