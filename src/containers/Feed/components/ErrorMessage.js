// react
import React from 'react'
import PropTypes from 'prop-types'

// material
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import CircularProgress from '@material-ui/core/CircularProgress'
import classnames from 'classnames'

const styles = theme => ({
  layout: {
    textAlign: 'center',
    width: 'auto',
    maxWidth: 500,
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 4,
    [theme.breakpoints.up(500 + theme.spacing.unit * 2 * 2)]: {
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingTop: theme.spacing.unit * 6
    },
    [theme.breakpoints.up(900 + theme.spacing.unit * 2 * 2)]: {
      paddingTop: theme.spacing.unit * 8,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    '& h1': {
      marginBottom: '0.55em'
    }
  },
  title: {
    marginBottom: `${theme.spacing.unit * 4}px!important`,
    [theme.breakpoints.up(800 + theme.spacing.unit * 2 * 2)]: {
      marginBottom: `${theme.spacing.unit * 6}px!important`
    },
    [theme.breakpoints.down(550 + theme.spacing.unit * 2 * 2)]: {
      fontSize: '3rem'
    },
    [theme.breakpoints.down(400 + theme.spacing.unit * 2 * 2)]: {
      fontSize: '2.7rem'
    }
  },
  grid: {
    [theme.breakpoints.down(500 + theme.spacing.unit * 2 * 2)]: {
      display: 'block!important',
      '& > div': {
        maxWidth: '100%'
      }
    },
    marginBottom: theme.spacing.unit * 4,
    [theme.breakpoints.up(800 + theme.spacing.unit * 2 * 2)]: {
      marginBottom: theme.spacing.unit * 6
    }
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
    }
  },
  links: {
    marginBottom: theme.spacing.unit * 4,
    [theme.breakpoints.up(800 + theme.spacing.unit * 2 * 2)]: {
      marginBottom: theme.spacing.unit * 6
    },
    '& a:hover': {
      textDecoration: 'underline',
    },
    '& a': {
      fontWeight: 500,
    },
    [theme.breakpoints.down(500 + theme.spacing.unit * 2 * 2)]: {
      fontSize: '2rem'
    },
    [theme.breakpoints.down(400 + theme.spacing.unit * 2 * 2)]: {
      fontSize: '1.7rem'
    }
  },

  refresh: {
    fontSize: '1.5rem',
    [theme.breakpoints.down(500 + theme.spacing.unit * 2 * 2)]: {
      fontSize: '1.3rem'
    },
    [theme.breakpoints.down(400 + theme.spacing.unit * 2 * 2)]: {
      fontSize: '1.2rem'
    }
  },

  username: {
    wordBreak: 'break-all'
  }
})

class ErrorMessage extends React.Component {
  componentDidMount () {

  }

  render () {
    let {classes, subscriptions, onRefresh, error, username, className} = this.props

    if (!subscriptions) {
      subscriptions = []
    }

    let message = 'Unknown error'
    let linkMessage = ''
    let linkLocation = ''
    let refresh = false

    if (error === 'fileProtocol') {
      message = <span>MetaMask does not allow <strong>file://</strong> protocol, use <strong>http(s)://</strong></span>
      linkMessage = ''
      linkLocation = ''
    }

    if (error === 'noPosts') {
      if (subscriptions.length === 0) {
        message = `You're not subscribed to anyone.`
        linkMessage = 'Find accounts to follow'
        linkLocation = 'follow'
      } else if (subscriptions.length === 1) {
        message = `Your 1 subscription hasn't posted anything.`
        linkMessage = 'Find more accounts to follow'
        linkLocation = 'follow'
        refresh = true
      } else {
        message = `Your ${subscriptions.length} subscriptions haven't posted anything.`
        linkMessage = 'Find more accounts to follow'
        linkLocation = 'follow'
        refresh = true
      }
    }

    if (error === 'noMorePosts') {
      message = `No more posts.`
      linkMessage = 'Find more accounts to follow'
      linkLocation = 'follow'
      refresh = true
    }

    if (error === 'isTerminated') {
      message = `User has deleted their account`
      linkMessage = ''
      linkLocation = ''
    }
    if (error === 'profileTerminated') {
      message = `You terminated your account`
      linkMessage = ''
      linkLocation = ''
    }
    if (error === 'unregisteredUsername') {
      message = <span>Username <strong className={classes.username}>{username}</strong> isn't registered.</span>
      linkMessage = 'Register it now'
      linkLocation = 'publish'
    }
    if (error === 'invalidUsername') {
      message = <span>Username <strong className={classes.username}>{username}</strong> is invalid</span>
      linkMessage = ''
      linkLocation = ''
    }
    if (error === 'notConnected') {
      message = `Connect your wallet.`
      linkMessage = `What's a wallet?`
      linkLocation = 'publish'
    }

    return (
      <div className={classnames(classes.layout, className)}>

        <Typography className={classes.links} variant='display1'>
          {message}
        </Typography>

        <Typography className={classes.links} variant='display1'>
          <a href={`https://subby.io/${linkLocation}`} target='_blank'>{linkMessage}</a>
          <br/>
          {refresh && 
            <span className={classes.refresh}>
              or <a onClick={onRefresh}>Refresh</a>
            </span>
          }
        </Typography>

      </div>
    )
  }
}

ErrorMessage.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ErrorMessage) // eslint-disable-line
