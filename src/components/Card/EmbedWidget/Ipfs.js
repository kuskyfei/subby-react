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
    overflowWrap: 'break-word'
  }
})

const Ipfs = (props) => {
  const {classes, url} = props

  return (
    <Typography className={classes.margin} variant='body2' component='div' gutterBottom>
      {url}
    </Typography>
  )
}

export default withStyles(styles)(Ipfs) // eslint-disable-line
