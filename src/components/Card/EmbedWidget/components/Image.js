import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = {
  image: {
    maxHeight: 600,
    maxWidth: '100%',
    transform: 'translateX(-50%)',
    marginLeft: '50%',
    animation: 'fadeIn ease 0.5s'
  }
}

const Image = (props) => {
  return (
    <img className={props.classes.image} src={props.url} />
  )
}

export default withStyles(styles)(Image)
