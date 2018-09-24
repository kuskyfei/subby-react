import React from 'react'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
  margin: {
    marginTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      paddingLeft: 24,
      paddingRight: 24
    },
    overflowWrap: 'break-word'
  },
  link: {
    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'underline'
    },
    cursor: 'pointer'
  },
  loading: {
    marginRight: 2,
    marginLeft: 2,
    transform: 'translateY(2.5px)',
    display: 'inline-flex',
    height: 10
  }
})

let Download = (props) => {
  const {classes, url} = props
  const {message, download, downloadMessage} = url

  return (
    <Typography className={classes.margin} variant='body2' component='div' gutterBottom>
      
      {message === 'Connecting.' &&
        <span className={classes.loading}>
          <CircularProgress className={classes.progress} size={15} />&nbsp;
        </span>
      }

      {message}&nbsp;
      
      <a
        className={classes.link}
        onClick={download}>
        {downloadMessage}
      </a>
    </Typography>
  )
}

export default withStyles(styles)(Download) // eslint-disable-line
