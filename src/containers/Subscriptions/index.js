// react
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators, compose} from 'redux'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'

// material
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'

// actions
import actions from './reducers/actions'

// api
// const services = require('../../services')

// util
const debug = require('debug')('containers:Subscriptions')

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 2 * 2)]: {
      paddingTop: theme.spacing.unit * 4,
      paddingBottom: theme.spacing.unit * 4,
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  grid: {
    [theme.breakpoints.down(800 + theme.spacing.unit * 2 * 2)]: {
      display: 'block',
      '& > div': {
        maxWidth: '100%'
      }
    }
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing.unit * 1,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginBottom: theme.spacing.unit * 2
    },
    '& textarea': {
      height: '60vh'
    }
  },
  message: {
    maxWidth: 600,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 2 * 2)]: {
      marginBottom: theme.spacing.unit * 4
    }
  },
  textField: {
    '& label': {
      whiteSpace: 'nowrap',
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    '& div:after': {
      display: 'none!important'
    },
    '& div:before': {
      display: 'none!important'
    }
  },
  button: {
    marginLeft: theme.spacing.unit / 2,
    marginRight: theme.spacing.unit / 2
  },
  buttons: {
    whiteSpace: 'nowrap',
    marginLeft: '50%',
    transform: 'translateX(-50%)',
    display: 'inline-block',
    marginBottom: theme.spacing.unit,
    [theme.breakpoints.up(900 + theme.spacing.unit * 2 * 2)]: {
      marginBottom: theme.spacing.unit
    }
  }
})

class Subscriptions extends React.Component {
  componentDidMount () {
    ;(async () => {

    })()

    debug('props', this.props)
    debug('mounted')
  }

  componentDidUpdate (prevProps) {
    debug('updated')
  }

  render () {
    const {classes, subscriptions} = this.props

    let counter = 0
    let subscriptionsString = ''
    for (const subscription in subscriptions) {
      subscriptionsString += `${subscription}\n`
      counter++
    }

    return (
      <div className={classes.layout}>

        <div className={classes.buttons} >
          <Button size='small' variant='contained' color='default' className={classes.button}>
            Save All
          </Button>
          <Button size='small' variant='contained' color='default' className={classes.button}>
            Import All
          </Button>
          <Button size='small' variant='contained' color='default' className={classes.button}>
            Export All
          </Button>
        </div>

        <div className={classes.root}>

          <Typography className={classes.message} variant='body1' align='center'>
            Your subscriptions are saved inside Chrome permanently, as long as you don't clear your cache. Export them to file or Sync them with Ethereum to migrate.
          </Typography>

          <Grid container spacing={24} className={classes.grid}>

            <Grid item xs={4}>

              <Paper className={classes.paper}>
                <TextField
                  className={classes.textField}
                  label='Local Logged Out Subscriptions'
                  fullWidth
                  multiline
                  disableUnderline
                  rows={counter}
                  defaultValue={subscriptionsString}
                />

              </Paper>
              <div className={classes.buttons} >
                <Button size='small' variant='contained' color='default' className={classes.button}>
                  Save
                </Button>
                <Button size='small' variant='contained' color='default' className={classes.button}>
                  Import
                </Button>
                <Button size='small' variant='contained' color='default' className={classes.button}>
                  Export
                </Button>
              </div>
            </Grid>

            <Grid item xs={4}>
              <Paper className={classes.paper}>
                <TextField
                  className={classes.textField}
                  label='Local Subscriptions of 0x0000000000000000000000000000000000000000'
                  fullWidth
                  multiline
                  disableUnderline
                  rows={counter}
                  defaultValue={subscriptionsString}
                />
              </Paper>
              <div className={classes.buttons} >
                <Button size='small' variant='contained' color='default' className={classes.button}>
                  Save
                </Button>
                <Button size='small' variant='contained' color='default' className={classes.button}>
                  Sync
                </Button>
                <Button size='small' variant='contained' color='default' className={classes.button}>
                  Import
                </Button>
                <Button size='small' variant='contained' color='default' className={classes.button}>
                  Export
                </Button>
              </div>
            </Grid>

            <Grid item xs={4}>
              <Paper className={classes.paper}>
                <TextField
                  className={classes.textField}
                  label='Ethereum Subscriptions of username'
                  fullWidth
                  multiline
                  disableUnderline
                  rows={counter}
                  defaultValue={subscriptionsString}
                />
              </Paper>
              <div className={classes.buttons} >
                <Button size='small' variant='contained' color='default' className={classes.button}>
                  Sync
                </Button>
                <Button size='small' variant='contained' color='default' className={classes.button}>
                  Import
                </Button>
                <Button size='small' variant='contained' color='default' className={classes.button}>
                  Export
                </Button>
              </div>
            </Grid>

          </Grid>
        </div>

      </div>
    )
  }
}

Subscriptions.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  subscriptions: state.app.subscriptions
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

const enhance = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)

export default enhance(Subscriptions) // eslint-disable-line
