// react
import React from 'react'
import {withRouter} from 'react-router-dom'
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
import MessageIcon from '@material-ui/icons/Message'
import HelpIcon from '@material-ui/icons/Help'

const styles = theme => ({
  container: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
  },
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

  input: {
    marginBottom: theme.spacing.unit
  },
  avatar: {
    margin: 'auto',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit / 2,
    '& img': {
      animation: 'fadeIn ease 1.5s',
    }
  },
  bigAvatar: {
    width: 70,
    height: 70
  },
  fadeIn: {
    animation: 'fadeIn ease 1.5s',
  },

  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 3,
  },
  publishButton: {
    marginLeft: 'auto'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  greyIcon: {
    color: theme.palette.grey['300'],
    fontSize: 36
  },

  donateTextField: {
    '& div': {
      background: theme.palette.background.paper,
      borderRadius: 5,
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      minHeight: theme.spacing.unit * 12
    },
    '& div:after': {
      display: 'none!important'
    },
    '& div:before': {
      display: 'none!important'
    },
    boxShadow: '0 0 2px 5px #e0e0e012',
    marginBottom: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit,
    '& textarea': {
      margin: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
    },
    '& textarea::placeholder': {
      color: theme.palette.text.hint
    }
  },
  disabled: {
    cursor: 'not-allowed',
    '& textarea': {
      cursor: 'not-allowed'
    }
  }
})

class Donate extends React.Component {
  state = {
    donationText: '',
    donationAmount: ''
  }

  componentDidMount = () => {
    const {classes, profile} = this.props
    let {minimumTextDonation, username, address, thumbnail} = profile

    if (minimumTextDonation === 0) minimumTextDonation = 0.01

    this.setState({...this.state, donationAmount: minimumTextDonation})
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  handleDonate = () => {
 
  }

  render() {
    const {classes, profile} = this.props
    const {donationText, donationAmount} = this.state
    const {minimumTextDonation, username, address, thumbnail} = profile

    const textDonationEnabled = (minimumTextDonation === 0) ? false : true

    return (
      <form className={classes.container} noValidate autoComplete='off'>

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
        </div>

        <FormControl fullWidth className={classes.margin}>
          <InputLabel>Donation</InputLabel>
          <Input
            className={classes.input}
            id="adornment-amount"
            value={donationAmount}
            defaultValue={donationAmount}
            onChange={this.handleChange('donationAmount')}
            startAdornment={<InputAdornment position="start">Ξ</InputAdornment>}
          />
        </FormControl>

        <Typography className={classes.message} variant='caption' gutterBottom>
          {textDonationEnabled &&
            `${username || address} has enabled text donations for amounts over ${minimumTextDonation}`
          }
          {!textDonationEnabled &&
            `${username || address} has not enabled text donations`
          }
        </Typography>

        <TextField
          disabled={!textDonationEnabled}
          className={classNames(classes.donateTextField, (!textDonationEnabled && classes.disabled))}
          fullWidth
          rows={3}
          multiline
          placeholder={textDonationEnabled && `Send a message to ${username || address}?`}
          value={donationText}
          onChange={this.handleChange('donationText')}
        />

        <div className={classes.buttonsContainer}>

          <Tooltip title={<HelpText />} placement='top-start'>
            <HelpIcon className={classes.greyIcon} />
          </Tooltip>

          <Button
            variant='contained'
            color='default'
            className={classes.publishButton}
            onClick={this.handleDonate.bind(this)}
          >
            <span className={classes.publishButtonText}>Donate</span>
            <MessageIcon className={classes.rightIcon} />
          </Button>
        </div>

      </form>
    )
  }
}

const HelpText = () =>
  <div>
    <p>
      Text donations are not private, they are stored publicly on Ethereum and IPFS. They are turned off by default and require a minimum amount to prevent spam.
    </p>
  </div>

export default withStyles(styles)(Donate) // eslint-disable-line
