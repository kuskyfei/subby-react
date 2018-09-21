import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = {
  whiteBorder: {
    position: 'relative',
    '&::before': {
      content: `' '`,
      display: 'block',
      border: '3px solid white',
      height: '100%',
      width: '100%',
      position: 'absolute',
      zIndex: 1,
      pointerEvents: 'none'
    }
  }
}

const Reddit = (props) =>

  <div className={props.classes.whiteBorder}>
    <blockquote className='reddit-card'>
      <a href={props.url} />
    </blockquote>
  </div>

export default withStyles(styles)(Reddit)
