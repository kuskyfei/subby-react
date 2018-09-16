import React from 'react'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = theme => ({
  margin: {
    marginTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      paddingLeft: 24,
      paddingRight: 24
    },
    overflowWrap: 'break-word',
  },
  link: {
    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'underline'
    },
    cursor: 'pointer'
  }
})

let Download = (props) => {
  const {classes, message, download, downloadMessage} = props

  return (
    <Typography className={classes.margin} variant='body2' component='div' gutterBottom>
      {message}&nbsp;
      <a 
        className={classes.link} 
        onClick={download}>
        {downloadMessage}
      </a>
    </Typography>
  )
}
Download = withStyles(styles)(Download)

export {Download}
