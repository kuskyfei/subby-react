import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 10,
    marginBottom: theme.spacing.unit * 10,
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
