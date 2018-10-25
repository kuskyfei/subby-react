// react
import React from 'react'
import PropTypes from 'prop-types'

// material
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import CircularProgress from '@material-ui/core/CircularProgress'

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

  loading: {
    margin: 'auto',
  }
})

class ErrorMessage extends React.Component {
  componentDidMount () {

  }

  state = {
    isLoading: false
  }

  async handleRefresh() {
    const {onRefresh} = this.props
    this.setState(state => ({isLoading: true}))
    await onRefresh()
    setTimeout(() => this.setState(state => ({isLoading:false})), 2000)
  }

  render () {
    let {classes, subscriptions, onRefresh} = this.props
    const {isLoading} = this.state

    let message = ''
    let linkMessage = ''
    if (subscriptions.length === 0) {
      message = `You're not subscribed to anyone.`
      linkMessage = 'Find accounts to follow'
    } else if (subscriptions.length === 1) {
      message = `Your 1 subscription hasn't posted anything.`
      linkMessage = 'Find more accounts to follow'
    } else {
      message = `Your ${subscriptions.length} subscriptions haven't posted anything.`
      linkMessage = 'Find more accounts to follow'
    }

    if (isLoading) {
      return (
        <div className={classes.layout}>
          <CircularProgress className={classes.loading} size={50} />
        </div>
      )
    }

    return (
      <div className={classes.layout}>

        <Typography className={classes.links} variant='display1'>
          {message}
        </Typography>

        <Typography className={classes.links} variant='display1'>
          <a href='https://subby.io/follow' target='_blank'>{linkMessage}</a>
          <br/>
          {onRefresh && 
            <span>
              or <a onClick={this.handleRefresh.bind(this)}>Refresh</a>
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
