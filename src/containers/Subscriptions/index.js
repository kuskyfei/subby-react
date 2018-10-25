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
import LinearProgress from '@material-ui/core/LinearProgress'
import classNames from 'classnames'
import HelpIcon from '@material-ui/icons/Help'
import Tooltip from '@material-ui/core/Tooltip'
import SaveIcon from '@material-ui/icons/Save'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import GetAppIcon from '@material-ui/icons/GetApp'
import PublishIcon from '@material-ui/icons/Publish'

// actions
import actions from './reducers/actions'

// api
const services = require('../../services')
const {
  subscriptionsStringToObject,
  subscriptionsObjectToString,
  downloadTextFile,
  getActiveSubscriptionsFromSubscriptions,
  importTextFile
} = require('./util')

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
    margin: 'auto',
    maxWidth: 500,
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
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
    marginRight: theme.spacing.unit / 2,
    [theme.breakpoints.up(700)]: {
      marginLeft: 20,
      marginRight: 20,
      transform: 'scale(1.35)'
    },
    [theme.breakpoints.up(600)]: {
      marginLeft: 16,
      marginRight: 16,
      transform: 'scale(1.2)'
    }
  },
  buttons: {
    whiteSpace: 'nowrap',
    marginLeft: '50%',
    transform: 'translateX(-50%)',
    display: 'inline-flex',
    marginTop: 32,
    [theme.breakpoints.down(700)]: {
      marginTop: 24
    },
    [theme.breakpoints.down(500)]: {
      display: 'grid',
      transform: 'none',
      marginLeft: 0,
      rowGap: '4px'
    }
  },

  loading: {
    borderRadius: '4px 4px 0 0'
  },
  loadingPaper: {
    padding: 0,
    paddingBottom: 43
  },

  greyIcon: {
    color: theme.palette.grey['300'],
    fontSize: 36,
    [theme.breakpoints.down(500)]: {
      margin: 'auto'
    }
  },
  saveIcon: {
    marginLeft: theme.spacing.unit / 2
  },

  lightTooltip: {
    background: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 12
  }
})

const HelpText = () =>
  <div>
    <p>
      SAVE your changes to Chrome's local database.
    </p>
    <p>
      IMPORT subscriptions from a text file.
    </p>
    <p>
      EXPORT subscriptions to a text file.
    </p>
  </div>

class Subscriptions extends React.Component {
  state = {
    localSubscriptions: {},
    originalSubscriptionsString: {},
    isLoading: false,
    saveTooltipOpen: false
  }

  componentDidMount () {
    const {actions} = this.props
    ;(async () => {
      this.setState({isLoading: true})
      const localSubscriptions = await services.getSubscriptions()
      const originalSubscriptionsString = subscriptionsObjectToString(localSubscriptions)
      this.setState({isLoading: false, localSubscriptions, originalSubscriptionsString})
    })()

    debug('mounted')
  }

  handleSave = async () => {
    let {localSubscriptions} = this.state
    const originalSubscriptionsString = localSubscriptions
    localSubscriptions = subscriptionsStringToObject(localSubscriptions)

    this.setState({saveTooltipOpen: true, originalSubscriptionsString})

    await services.setSubscriptions(localSubscriptions)

    setTimeout(() => {
      this.setState({saveTooltipOpen: false, originalSubscriptionsString})
    }, 500)
  }

  handleExport = async () => {
    let {localSubscriptions} = this.state

    const subscriptionsString = subscriptionsObjectToString(localSubscriptions)
    const date = new Date().toISOString()
    const fileName = `subby-subscriptions-${date}.txt`

    downloadTextFile({text: subscriptionsString, fileName})
  }

  handleImport = async () => {
    const file = await importTextFile()
    this.setState({localSubscriptions: file})
  }

  componentDidUpdate (prevProps) {
    debug('updated')
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  render () {
    const {classes, profile} = this.props
    const {localSubscriptions, isLoading, saveTooltipOpen, originalSubscriptionsString} = this.state

    // we need to format the subscriptions object to a string
    // on first render otherwise it is simply a string
    let localSubscriptionsString = ''
    if (typeof localSubscriptions === 'object') {
      localSubscriptionsString = subscriptionsObjectToString(localSubscriptions)
    }
    if (typeof localSubscriptions === 'string') {
      localSubscriptionsString = localSubscriptions
    }

    const hasChanges = originalSubscriptionsString !== localSubscriptionsString

    return (
      <div className={classes.layout}>

        <div className={classes.root}>

          <Typography className={classes.message} variant='body1' align='center'>
            Your subscriptions are saved inside Chrome permanently, as long as you don't clear your cache.
          </Typography>

          {isLoading &&
            <Paper className={classNames(classes.paper, classes.loadingPaper)}>
              <LinearProgress className={classes.loading} />
              <TextField className={classes.textField} multiline disableUnderline disabled />
            </Paper>
          }

          {!isLoading &&
            <Paper className={classes.paper}>
              <TextField
                className={classes.textField}
                label='Local Subscriptions'
                fullWidth
                multiline
                disableUnderline
                value={localSubscriptionsString}
                rows={5}
                onChange={this.handleChange('localSubscriptions')}
                autoFocus
              />
            </Paper>
          }

          <div className={classes.buttons} >
            <Tooltip
              title='Saved!'
              classes={{tooltip: classes.lightTooltip}}
              open={saveTooltipOpen}
            >
              <Button disabled={!hasChanges} onClick={this.handleSave} size='small' variant='contained' color='default' className={classes.button}>
                Save
                <SaveIcon className={classes.saveIcon} />
              </Button>
            </Tooltip>
            <Button onClick={this.handleImport} size='small' variant='contained' color='default' className={classes.button}>
              Import
              <PublishIcon className={classes.rightIcon} />
            </Button>
            <Button onClick={this.handleExport} size='small' variant='contained' color='default' className={classes.button}>
              Export
              <GetAppIcon className={classes.rightIcon} />
            </Button>
            <Tooltip title={<HelpText />} placement='top-end'>
              <HelpIcon className={classNames(classes.greyIcon, classes.button)} />
            </Tooltip>
          </div>
        </div>

      </div>
    )
  }
}

Subscriptions.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  subscriptions: state.subscriptions,
  profile: state.app.profile
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
