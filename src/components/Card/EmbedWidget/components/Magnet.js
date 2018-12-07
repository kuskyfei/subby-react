import React from 'react'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import CircularProgress from '@material-ui/core/CircularProgress'

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
  },
  loadingWrapper: {
    marginLeft: 8,
    transform: 'translateY(3px)',
    display: 'inline-block'
  }
})

class Magnet extends React.Component {
  hasWssTracker = (magnet) => {
    const {settings} = this.props

    if (settings && !settings.WEB_TORRENT_EMBEDS) {
      return false
    }
    return !!magnet.match(/&tr=wss/)
  }

  state = {
    isLoading: this.hasWssTracker(this.props.url)
  }

  componentDidMount() {
    const {isLoading} = this.state

    // try loading web torrent for 5 seconds then give up
    if (isLoading) {
      setTimeout(() => this.setState({isLoading: false}), 10000)
    }
  }

  render() {
    const {classes, url} = this.props
    const {isLoading} = this.state

    return (
      <Typography className={classes.margin} variant='body2' component='div' gutterBottom>
        <a className={classes.link} href={url}>
          {url}
          {isLoading && <div className={classes.loadingWrapper}><CircularProgress className={classes.progress} size={15} /></div>}
        </a>
      </Typography>
    )
  }
} 

export default withStyles(styles)(Magnet) // eslint-disable-line
