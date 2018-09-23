// react
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators, compose} from 'redux'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'

// material
import withStyles from '@material-ui/core/styles/withStyles'

// actions
import actions from './reducers/actions'

// api
// const services = require('../../services')

// util
const debug = require('debug')('containers:Settings')

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6
    }
  }
})

class Settings extends React.Component {
  state = {}

  componentDidMount () {
    ;(async () => {

    })()

    debug('props', this.props)
    debug('mounted')
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
    const { classes } = this.props

    return (
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <form className={classes.container} noValidate autoComplete='off'>

            <TextField
              fullWidth
              placeholder='https://example.com'
              label='Web3 Provider'
              className={classes.textField}
              value={this.state.web3Provider}
              onChange={this.handleChange('web3Provider')}
              margin='normal'
            />

            <Typography className={classes.message} variant='caption' gutterBottom>
              To use web3, you must connect to an Ethereum node. Subby uses Infura by default. You can add your own here. Note that if you have Metamask enabled, the MetaMask default provider will be used.
            </Typography>

            <TextField
              fullWidth
              placeholder='https://example.com:8080'
              label='IPFS Provider'
              className={classes.textField}
              value={this.state.ipfsProvider}
              onChange={this.handleChange('ipfsProvider')}
              margin='normal'
            />

            <Typography className={classes.message} variant='caption' gutterBottom>
              To use IPFS, you must connect to an IPFS node. Subby uses infura by default. You can add your own here.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={this.state.redditEmbeds}
                  onChange={this.handleChange('redditEmbeds')}
                  value='redditEmbeds'
                  color='primary'
                />
              }
              label='Reddit Embeds'
            />

            <FormControlLabel
              control={
                <Switch
                  checked={this.state.facebookEmbeds}
                  onChange={this.handleChange('facebookEmbeds')}
                  value='facebookEmbeds'
                  color='primary'
                />
              }
              label='Facebook Embeds'
            />

            <FormControlLabel
              control={
                <Switch
                  checked={this.state.youtubeEmbeds}
                  onChange={this.handleChange('youtubeEmbeds')}
                  value='youtubeEmbeds'
                  color='primary'
                />
              }
              label='Youtube Embeds'
            />

            <FormControlLabel
              control={
                <Switch
                  checked={this.state.vimeoEmbeds}
                  onChange={this.handleChange('vimeoEmbeds')}
                  value='vimeoEmbeds'
                  color='primary'
                />
              }
              label='Vimeo Embeds'
            />

            <FormControlLabel
              control={
                <Switch
                  checked={this.state.twitterEmbeds}
                  onChange={this.handleChange('twitterEmbeds')}
                  value='twitterEmbeds'
                  color='primary'
                />
              }
              label='Twitter Embeds'
            />

            <FormControlLabel
              control={
                <Switch
                  checked={this.state.instagramEmbeds}
                  onChange={this.handleChange('instagramEmbeds')}
                  value='instagramEmbeds'
                  color='primary'
                />
              }
              label='Instagram Embeds'
            />

            <Typography className={classes.message} variant='caption' gutterBottom>
              Embed content makes Subby fun to use, but it also allows companies to track you. Turn them off here.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={this.state.ipfsEmbeds}
                  onChange={this.handleChange('ipfsEmbeds')}
                  value='ipfsEmbeds'
                  color='primary'
                />
              }
              label='IPFS Embeds'
            />

            <Typography className={classes.message} variant='caption' gutterBottom>
              IPFS is great, but nodes/providers might be able to track you. Turn it off here.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={this.state.webTorrentEmbeds}
                  onChange={this.handleChange('webTorrentEmbeds')}
                  value='webTorrentEmbeds'
                  color='primary'
                />
              }
              label='Web Torrent Embeds'
            />

            <Typography className={classes.message} variant='caption' gutterBottom>
              Web torrent allows you to connect to other web torrent enabled clients, Those might be able to track you. Turn it off here.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={this.state.googleAnalyics}
                  onChange={this.handleChange('googleAnalyics')}
                  value='googleAnalyics'
                  color='primary'
                />
              }
              label='Google Analytics'
            />

            <Typography className={classes.message} variant='caption' gutterBottom>
              Google analytics is 100% anonymous, the data is used to improve Subby user experience.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={this.state.updateNotifications}
                  onChange={this.handleChange('updateNotifications')}
                  value='updateNotifications'
                  color='primary'
                />
              }
              label='Update Notifications'
            />

            <Typography className={classes.message} variant='caption' gutterBottom>
              Get notified when updates and security fixes are released. This is done through Subby and does not require a connection to a centralized server.
            </Typography>

          </form>
        </Paper>
      </div>
    )
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  settings: state.app.settings
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

const enhance = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)

export default enhance(Settings) // eslint-disable-line
