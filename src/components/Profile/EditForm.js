// react
import React from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import Tooltip from '@material-ui/core/Tooltip'
import FormControl from '@material-ui/core/FormControl'
import classNames from 'classnames'
import Avatar from '@material-ui/core/Avatar'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import HelpIcon from '@material-ui/icons/Help'

const services = require('../../services')
const {settings} = require('../../settings')
const {onFinishedTyping} = require('./util')

const styles = theme => ({
  profile: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6
    },
    textAlign: 'center'
  },
  username: {
    margin: theme.spacing.unit,
    animation: 'fadeIn ease 1.5s'
  },
  bio: {
    margin: theme.spacing.unit,
    animation: 'fadeIn ease 1.5s',
    wordBreak: 'break-all'
  },

  textField: {
    marginTop: theme.spacing.unit / 2
  },
  firstTextField: {
    marginTop: 0
  },
  input: {
    marginBottom: theme.spacing.unit
  },
  avatar: {
    margin: 'auto',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit / 2,
    '& img': {
      animation: 'fadeIn ease 1.5s'
    }
  },
  bigAvatar: {
    width: 70,
    height: 70
  },
  fadeIn: {
    animation: 'fadeIn ease 1.5s'
  },

  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 3
  },
  publishButton: {
    marginLeft: 'auto',
    minWidth: 120
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  greyIcon: {
    color: theme.palette.grey['300'],
    fontSize: 36
  },

  errorMessage: {
    paddingRight: 8,
    paddingLeft: 8,
    '& a': {
      fontWeight: 700
    },
    '& strong': {
      fontWeight: 700,
    },
    '& p': {
      color: 'rgb(255, 0, 0)'
    },
    [theme.breakpoints.down(450)]: {
      '& p': {
        fontSize: 12
      }
    }
  },
  address: {
    wordBreak: 'break-all'
  }
})

class EditForm extends React.Component {
  state = {
    username: '',
    usernameError: '',
    bio: '',
    thumbnail: '',
    textDonationEnabled: '',
    hideDonations: '',
    minimumTextDonation: '',
    address: '',
    usernameIsEditable: true,
    errorMessage: null
  }

  componentDidMount = () => {
    const {profile} = this.props

    this.setState({
      ...profile,
      usernameIsEditable: !profile.username,
      textDonationEnabled: !!profile.minimumTextDonation
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  handleSwitch = name => event => {
    this.setState({
      [name]: !this.state[name]
    })
  }

  handleUsernameChange = event => {
    const username = event.target.value
    this.setState({
      ...this.state,
      username,
      usernameError: null
    })

    if (username.length > 39) {
      this.setState({
        ...this.state,
        username,
        usernameError: 'Over 39 characters'
      })
    }

    onFinishedTyping(async () => {
      const profile = await services.getProfile(username)
      const usernameAvailable = profile.address === '0x0000000000000000000000000000000000000000' && !profile.isTerminated

      if (!usernameAvailable) {
        this.setState({
          ...this.state,
          username,
          usernameError: 'Username taken'
        })
      }
    })
  }

  handlePublish = async () => {
    this.setState({errorMessage: null})

    const {profile, classes} = this.props
    let {username, bio, thumbnail, hideDonations, minimumTextDonation, textDonationEnabled, usernameError} = this.state

    if (usernameError) {
      return
    }

    // handle errors
    if (!this.hasChanges()) {
      this.setState({errorMessage: <Typography variant="body1">No changes to publish. <a href="https://subby.io/publish">Need help?</a></Typography>})
      return
    }
    if (Number(minimumTextDonation) <= 0 && textDonationEnabled) {
      this.setState({errorMessage: <Typography variant="body1">Minimum text donation must be greater than 0. <a href="https://subby.io/publish">Need help?</a></Typography>})
      return
    }
    const address = await services.getAddress()
    if (!await services.getAddress()) {
      this.setState({errorMessage: <Typography variant="body1">Wallet not connected. <a href="https://subby.io/publish">Need help?</a></Typography>})
      return
    }
    const network = await services.getNetwork()
    if (settings.ETHEREUM_NETWORK !== network) {
      this.setState({errorMessage: <Typography variant="body1">Network not set to {settings.ETHEREUM_NETWORK}. <a href="https://subby.io/publish">Need help?</a></Typography>})
      return
    }
    if (profile.isTerminated) {
      this.setState({errorMessage: <Typography variant="body1">Cannot edit a terminated account</Typography>})
      return
    }
    if (address !== profile.address) {
      this.setState({errorMessage: <Typography variant="body1">Not logged in to <strong className={classes.address}>{profile.address}</strong></Typography>})
      return
    }

    if (username === profile.username) username = null
    if (bio === profile.bio) bio = null
    if (thumbnail === profile.thumbnail) thumbnail = null
    if (hideDonations === profile.hideDonations) hideDonations = null
    if (!textDonationEnabled) minimumTextDonation = 0
    if (minimumTextDonation === profile.minimumTextDonation) minimumTextDonation = null

    await services.editProfile({username, bio, thumbnail, hideDonations, minimumTextDonation})
    window.dispatchEvent(new CustomEvent('transaction', {detail: {type: 'editProfile'}}))
  }

  hasChanges = () => {
    const {profile} = this.props
    let {username, bio, thumbnail, minimumTextDonation, hideDonations, textDonationEnabled} = this.state

    if (!textDonationEnabled) minimumTextDonation = 0

    const hasChanges = (
      username === profile.username 
      && bio === profile.bio 
      && thumbnail === profile.thumbnail 
      && hideDonations === profile.hideDonations 
      && minimumTextDonation === profile.minimumTextDonation
    ) ? false : true

    return hasChanges
  }

  render () {
    const {classes, profile} = this.props
    let {username, usernameError, bio, thumbnail, textDonationEnabled, minimumTextDonation, address, usernameIsEditable, hideDonations, errorMessage} = this.state

    const minimumDonationIsTooSmall = ((typeof minimumTextDonation === 'number') && (minimumTextDonation !== 0) && (minimumTextDonation.toFixed(4) < 0.0001))
    if (minimumDonationIsTooSmall) minimumTextDonation = 0.0001

    return (
      <form className={classes.container} noValidate autoComplete='off'>

        <TextField
          disabled={!usernameIsEditable}
          error={usernameError}
          fullWidth
          placeholder=''
          label={usernameError || 'Username'}
          className={classes.firstTextField}
          value={username || ''}
          defaultValue={username || ''}
          onChange={this.handleUsernameChange.bind(this)}
          margin='normal'
        />

        <Typography className={classes.message} variant='caption' gutterBottom>
          Choose a unique username between 1-39 characters. It can never be changed. Spaces at beginning and end are trimmed.
        </Typography>

        <div className={classes.profile}>
          <Avatar
            alt={username || address}
            src={thumbnail}
            className={classNames(classes.avatar, classes.bigAvatar, (!thumbnail && classes.fadeIn))}
          >
            {(username && username.substring(0, 2)) || (address && address.substring(0, 2))}
          </Avatar>
          <Typography className={classes.username} variant='title' noWrap gutterBottom>
            {username || address}
          </Typography>
          {bio &&
            <Typography className={classes.bio} variant='body1' gutterBottom>
              {bio}
            </Typography>
          }
        </div>

        <TextField
          fullWidth
          placeholder='https://example.com/image.jpg'
          label='Thumbnail'
          className={classes.firstTextField}
          value={thumbnail || ''}
          defaultValue={thumbnail || ''}
          onChange={this.handleChange('thumbnail')}
          margin='normal'
        />

        <Typography className={classes.message} variant='caption' gutterBottom>
          Choose a thumbnail image for your profile. You can change it at any time. Use a direct link to an image.
        </Typography>

        <TextField
          fullWidth
          placeholder=''
          label='Bio'
          className={classes.textField}
          value={bio || ''}
          defaultValue={bio || ''}
          onChange={this.handleChange('bio')}
          margin='normal'
          multiline
        />

        <Typography className={classes.message} variant='caption' gutterBottom>
          Write a bio for your profile. You can change it at any time. Keep it short (under 280 characters). Plain text only.
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={textDonationEnabled}
              onChange={this.handleSwitch('textDonationEnabled')}
              value={textDonationEnabled}
              color='primary'
            />
          }
          label='Enable Text Donations'
        />

        <FormControlLabel
          control={
            <Switch
              checked={hideDonations}
              onChange={this.handleSwitch('hideDonations')}
              value={hideDonations}
              color='primary'
            />
          }
          label='Hide Donations'
        />

        <FormControl fullWidth className={classes.margin}>
          <InputLabel>Minimum Text Donation</InputLabel>
          <Input
            disabled={!textDonationEnabled}
            className={classes.input}
            id='adornment-amount'
            value={minimumTextDonation || ''}
            defaultValue={minimumTextDonation || ''}
            onChange={this.handleChange('minimumTextDonation')}
            startAdornment={<InputAdornment position='start'>Ξ</InputAdornment>}
          />
        </FormControl>

        <Typography className={classes.message} variant='caption' gutterBottom>
          Fans can send text messages with their donations. A minimum text donation is required to prevent spam.
        </Typography>

        <div className={classes.buttonsContainer}>

          <Tooltip title={<HelpText />} placement='top-start'>
            <HelpIcon className={classes.greyIcon} />
          </Tooltip>

          <span className={classes.errorMessage}>
            {errorMessage}
          </span>

          <Button
            variant='contained'
            color='default'
            className={classes.publishButton}
            onClick={this.handlePublish}
          >
            <span className={classes.publishButtonText}>Publish</span>
            <CloudUploadIcon className={classes.rightIcon} />
          </Button>
        </div>

      </form>
    )
  }
}

const HelpText = () =>
  <div>
    <p>
      Profiles are published on the public Ethereum blockchain. The lengthier the thumbnail and bio, the more gas required.
    </p>
  </div>

export default withStyles(styles)(EditForm) // eslint-disable-line
