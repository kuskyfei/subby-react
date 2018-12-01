// This file is currently not being used, but might be useful later
// It's a dropdown to choose a codec

// react
import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import HelpIcon from '@material-ui/icons/Help'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit
  },

  greyIcon: {
    color: theme.palette.grey['300'],
    fontSize: 20,
    transform: 'translate(2px, 3.5px)'
  },

  publishButtonLoading: {
    display: 'inline-block',
    minWidth: 24,
    transform: 'translateY(2px)'
  },
  black: {
    color: 'rgba(0, 0, 0, 0.87)!important'
  },

  textField: {
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
    '& textarea': {
      margin: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
    },
    '& textarea::placeholder': {
      color: theme.palette.text.hint
    }
  },

  errorMessage: {
    paddingRight: 8,
    paddingLeft: 8,
    [theme.breakpoints.down(450)]: {
      '& p': {
        fontSize: 12
      }
    },
    '& a': {
      fontWeight: 600
    },
    '& strong': {
      fontWeight: 600
    },
    '& p': {
      color: 'rgb(255, 0, 0)'
    },
  },

  codecsInput: {
    '& div:focus': {
      background: 'unset'
    }
  },
  codecsWrapper: {
    animation: 'fadeIn ease 1s'
  }

})

class Codecs extends React.Component {
  state = {
    codecsString: ''
  }

  handleCodecsChange = (event) => {
    const {onCodecsChange} = this.props

    const value = event.target.value
    this.setState(state => ({
      codecsString: value,
    }))

    if (onCodecsChange) {
      onCodecsChange(value)
    }
  }

  render () {
    const {codecsNeeded, classes} = this.props
    const {codecsString} = this.state

    let codecsStrings
    if (codecsNeeded === 'audio') {
      codecsStrings = audioCodecs
    }
    if (codecsNeeded === 'video') {
      codecsStrings = videoCodecs
    }
    if (codecsNeeded === 'media') {
      codecsStrings = videoCodecs.concat(audioCodecs)
    }

    const codecsMenu = []
    for (const codecs of codecsStrings) {
      codecsMenu.push(
        <MenuItem key={codecs} value={codecs}>
          {codecs}
        </MenuItem>
      )
    }

    return (
      <div className={classes.codecsWrapper}>
        <Typography variant='caption' gutterBottom>
          Codecs
          <Tooltip leaveDelay={3000} title={<CodecsHelpText type={codecsNeeded}/>} placement='top-start'>
            <HelpIcon className={classes.greyIcon} />
          </Tooltip>
        </Typography>
        <TextField
          placeholder="Codecs"
          className={classes.codecsInput}
          select
          fullWidth
          value={this.state.codecsString}
          onChange={this.handleCodecsChange}
        >
          {codecsMenu}
        </TextField>
      </div>
    )
  }
}

const videoCodecs = [
  'video/webm; codecs="vp8"',
  'video/webm; codecs="vorbis"',
  'video/webm; codecs="vp8, vorbis"',
  'video/webm; codecs="vorbis, vp8"',
  'video/mp4; codecs="avc1.4d001e"',
  'video/mp4; codecs="avc1.42001e"',
  'video/mp4; codecs="mp4a.40.2"',
  'video/mp4; codecs="avc1.4d001e, mp4a.40.2"',
  'video/mp4; codecs="mp4a.40.2, avc1.4d001e"',
  'video/mp4; codecs="avc1.4d001e, mp4a.40.5"'
]

const audioCodecs = [
  'audio/webm; codecs="vorbis"',
  'audio/mp4; codecs="mp4a.40.2"',
  'audio/mp4; codecs="mp4a.40.5"',
  'audio/mp4; codecs="mp4a.67"'
]

const CodecsHelpText = (props) => {
  let {type} = props

  return (
    <div>
      <p>
        {capitalize(type)} files must be encoded using one of the compatible codecs to be embeded in the browser. <b><a target="_blank" href="https://subby.io/encode">How to encode {type}</a></b>
      </p>
    </div>
  )
}

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default withStyles(styles)(Codecs) // eslint-disable-line
