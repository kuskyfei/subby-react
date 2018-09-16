import React from 'react'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = theme => ({
  link: {
    display: 'block',
    color: theme.palette.primary.main,
    overflowWrap: 'break-word',
    '&:hover': {
      textDecoration: 'underline'
    },
    paddingLeft: 16,
    paddingRight: 16,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      paddingLeft: 24,
      paddingRight: 24
    }
  },
  margin: {
    marginTop: 16
  }
})

const Link = (props) => {
  const {classes} = props
  const url = formatUrl(props.url)

  return (
    <Typography className={classes.margin} variant='body2' component='div' gutterBottom>
      <a className={classes.link} target='_blank' href={url}>{props.url}</a>
    </Typography>
  )
}

const formatUrl = (url) => {
  if (!url.match(/^http/)) {
    url = 'http://' + url
  }
  return url
}

export default withStyles(styles)(Link) // eslint-disable-line
