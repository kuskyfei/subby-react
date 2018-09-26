import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 2
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  mb: {
    fontSize: 10,
    fontWeight: 500
  }
})

const Loading = (props) => {
  const {classes, url} = props

  const progress = getProgressInMbsFromUrl(url)

  return (
    <div className={classes.root}>
      <CircularProgress className={classes.progress} size={50} />
      {progress &&
        <Typography className={classes.mb} alivariant='body2' component='div'>
          {progress}
        </Typography>
      }
    </div>
  )
}

const getProgressInMbsFromUrl = (url) => {
  const progress = url.replace(/^loading:?/, '')
  return progress
}

export default withStyles(styles)(Loading)
