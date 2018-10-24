import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  progress: {
    margin: theme.spacing.unit * 2
  }
})

const Loading = (props) => {
  const {classes} = props

  return (
    <div className={classes.root}>
      <CircularProgress className={classes.progress} size={50} />
    </div>
  )
}

export default withStyles(styles)(Loading)
