// react
import React from 'react'
import PropTypes from 'prop-types'

// material
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = theme => ({
  layout: {
    textAlign: 'center',
    width: 'auto',
    maxWidth: 500,
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 4,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      marginLeft: theme.spacing.unit * 6,
      marginRight: theme.spacing.unit * 6,
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
      textDecoration: 'underline'
    },
    [theme.breakpoints.down(500 + theme.spacing.unit * 2 * 2)]: {
      '& h1': {
        fontSize: '2rem'
      }
    },
    [theme.breakpoints.down(400 + theme.spacing.unit * 2 * 2)]: {
      '& h1': {
        fontSize: '1.7rem'
      }
    }
  }
})

class FindSubscriptions extends React.Component {
  componentDidMount () {

  }

  render () {
    const {classes} = this.props

    return (
      <div className={classes.layout}>

        <Typography className={classes.links} variant='display1' gutterBottom>
          You're not subscribed to anyone. <a href='https://subby.io/follow' target='_blank'>Find accounts to follow</a>
        </Typography>

      </div>
    )
  }
}

FindSubscriptions.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FindSubscriptions) // eslint-disable-line
