// react
import React from 'react'
import {compose} from 'redux'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'

// material
import withStyles from '@material-ui/core/styles/withStyles'

// api
const services = require('../../services')

// util
const debug = require('debug')('containers:Settings')
const {onFinishedTyping} = require('./util')

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
      const settings = await services.getSettings()
      this.setState(settings)

      const address = await services.getAddress()
      if (!address) {
        return
      }
      const profile = await services.getProfile(address)
      this.setState({isTerminated: profile.isTerminated})
    })()

    debug('mounted')
  }

  componentDidUpdate (prevProps) {
    debug('updated')
  }

  handleValueChange = name => event => {
    const value = event.target.value
    this.setState({
      [name]: value
    })
    onFinishedTyping(async () => {
      await services.setSettings({...this.state, [name]: value})
      await services.init()
    })
  }

  handleCheckedChange = name => async event => {
    this.setState({
      [name]: event.target.checked
    })
    await services.setSettings({...this.state, [name]: event.target.checked})
  }

  handleTerminate = async () => {
    await services.terminateAccount()
  }

  render () {
    const {isTerminated} = this.state
    const {classes} = this.props

    return (
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <form className={classes.container} noValidate autoComplete='off'>

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(this.state.USE_DEFAULT_SETTINGS)}
                  onChange={this.handleCheckedChange('USE_DEFAULT_SETTINGS')}
                  value='USE_DEFAULT_SETTINGS'
                  color='primary'
                />
              }
              label='Use Default Settings'
            />

            <Typography className={classes.message} variant='caption' gutterBottom>
              Default settings are defined at the top of subby.html.
            </Typography>

            <TextField
              fullWidth
              placeholder='https://example.com'
              label='Web3 Provider'
              className={classes.textField}
              value={this.state.WEB3_PROVIDER || ''}
              onChange={this.handleValueChange('WEB3_PROVIDER')}
              margin='normal'
              disabled={this.state.USE_DEFAULT_SETTINGS}
            />

            <Typography className={classes.message} variant='caption' gutterBottom>
              To use web3, you must connect to an Ethereum node. Leave blank to use ethers.js default provider. If you have MetaMask enabled, the MetaMask provider will be used.
            </Typography>

            <TextField
              fullWidth
              placeholder='https://example.com:8080'
              label='IPFS Provider'
              className={classes.textField}
              value={this.state.IPFS_PROVIDER || ''}
              onChange={this.handleValueChange('IPFS_PROVIDER')}
              margin='normal'
              disabled={this.state.USE_DEFAULT_SETTINGS}
            />

            <Typography className={classes.message} variant='caption' gutterBottom>
              To use IPFS, you must connect to an IPFS node. Leave blank to use Infura default.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(this.state.REDDIT_EMBEDS)}
                  onChange={this.handleCheckedChange('REDDIT_EMBEDS')}
                  value='REDDIT_EMBEDS'
                  color='primary'
                  disabled={this.state.USE_DEFAULT_SETTINGS}
                />
              }
              label='Reddit Embeds'
            />

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(this.state.FACEBOOK_EMBEDS)}
                  onChange={this.handleCheckedChange('FACEBOOK_EMBEDS')}
                  value='FACEBOOK_EMBEDS'
                  color='primary'
                  disabled={this.state.USE_DEFAULT_SETTINGS}
                />
              }
              label='Facebook Embeds'
            />

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(this.state.YOUTUBE_EMBEDS)}
                  onChange={this.handleCheckedChange('YOUTUBE_EMBEDS')}
                  value='YOUTUBE_EMBEDS'
                  color='primary'
                  disabled={this.state.USE_DEFAULT_SETTINGS}
                />
              }
              label='Youtube Embeds'
            />

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(this.state.VIMEO_EMBEDS)}
                  onChange={this.handleCheckedChange('VIMEO_EMBEDS')}
                  value='VIMEO_EMBEDS'
                  color='primary'
                  disabled={this.state.USE_DEFAULT_SETTINGS}
                />
              }
              label='Vimeo Embeds'
            />
{/* there's a bug with twitter and instagram
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(this.state.TWITTER_EMBEDS)}
                  onChange={this.handleCheckedChange('TWITTER_EMBEDS')}
                  value='TWITTER_EMBEDS'
                  color='primary'
                  disabled={this.state.USE_DEFAULT_SETTINGS}
                />
              }
              label='Twitter Embeds'
            />

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(this.state.INSTAGRAM_EMBEDS)}
                  onChange={this.handleCheckedChange('INSTAGRAM_EMBEDS')}
                  value='INSTAGRAM_EMBEDS'
                  color='primary'
                  disabled={this.state.USE_DEFAULT_SETTINGS}
                />
              }
              label='Instagram Embeds'
            />
*/}
            <Typography className={classes.message} variant='caption' gutterBottom>
              Links are embeded from sites using iframes or Javascript.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(this.state.IPFS_EMBEDS)}
                  onChange={this.handleCheckedChange('IPFS_EMBEDS')}
                  value='IPFS_EMBEDS'
                  color='primary'
                  disabled={this.state.USE_DEFAULT_SETTINGS}
                />
              }
              label='IPFS Embeds'
            />

            <Typography className={classes.message} variant='caption' gutterBottom>
              Supported IPFS media are embeded into posts.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(this.state.WEB_TORRENT_EMBEDS)}
                  onChange={this.handleCheckedChange('WEB_TORRENT_EMBEDS')}
                  value='WEB_TORRENT_EMBEDS'
                  color='primary'
                  disabled={this.state.USE_DEFAULT_SETTINGS}
                />
              }
              label='Web Torrent Embeds'
            />

            <Typography className={classes.message} variant='caption' gutterBottom>
              Web torrent connects to other web torrent enabled clients and embeds metadata.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(this.state.GOOGLE_ANALYTICS)}
                  onChange={this.handleCheckedChange('GOOGLE_ANALYTICS')}
                  value='GOOGLE_ANALYTICS'
                  color='primary'
                  disabled={this.state.USE_DEFAULT_SETTINGS}
                />
              }
              label='Google Analytics'
            />

            <Typography className={classes.message} variant='caption' gutterBottom>
              Google Analytics is 100% anonymous, no personally identifiable information. Data is used to improve Subby user experience.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(this.state.UPDATE_NOTIFICATIONS)}
                  onChange={this.handleCheckedChange('UPDATE_NOTIFICATIONS')}
                  value='UPDATE_NOTIFICATIONS'
                  color='primary'
                  disabled={this.state.USE_DEFAULT_SETTINGS}
                />
              }
              label='Update Notifications'
            />

            <Typography className={classes.message} variant='caption' gutterBottom>
              Get notified when updates and security fixes are released. This is done through Subby and does not require a connection to a centralized server.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  disabled={isTerminated}
                  checked={Boolean(isTerminated)}
                  onChange={this.handleTerminate}
                  color='primary'
                />
              }
              label='Terminate Account'
            />

            <Typography className={classes.message} variant='caption' gutterBottom>
              A terminated account will hide all its posts and profile information, as well as disable donations and publishing. It is permanent and requires an Ethereum transaction. Hidden posts are not deleted, nothing can be deleted from Ethereum.
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

const enhance = compose(
  withStyles(styles)
)

export default enhance(Settings) // eslint-disable-line
