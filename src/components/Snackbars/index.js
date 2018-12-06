import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const debug = require('debug')('components:Snackbar')
const services = require('../../services')

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
  snackbar: {
    '& > div > div:nth-of-type(1)': {
      flex: 1,
      paddingBottom: 16,
      paddingTop: 12
    }
  }
})

class Snackbars extends React.Component {
  queue = []

  state = {
    open: false,
    messageInfo: {},
  }

  componentDidMount() {
    window.addEventListener('snackbar', this.handleSnackbarEvent)

    if (!window.chrome) {
      this.newSnackbar({message: 'Subby might not work properly in non-Chrome based browsers.', autoHideDuration: 15000})
    }
  }

  componentWillUnmount = (prevProps) => {
    window.removeEventListener('snackbar', this.handleSnackbarEvent)
  }

  handleSnackbarEvent = (event) => {
    const {type, link, comment} = event.detail

    debug('snackbar event', event.detail)

    if (type === 'post') {
      this.newSnackbar({
        message: comment, 
        button: <a href={link} target="_blank" >Learn More</a>,
        autoHideDuration: 15000
      })
    }

    if (type === 'somePostsUnavailable') {
      this.newSnackbar({
        message: 'Some posts are unavailable. Download subby.html to view your full feed.', 
        button: <a href='' download>Download</a>,
        autoHideDuration: 15000
      })
    }
  }

  newSnackbar = ({message, button, onButtonClick = () => {}, autoHideDuration = 6000}) => {
    this.queue.push({
      message,
      button,
      onButtonClick,
      autoHideDuration,
      key: new Date().getTime(),
    })

    if (this.state.open) {
      // immediately begin dismissing current message
      // to start showing new one
      this.setState({ open: false })
    } else {
      this.processQueue()
    }
  }

  processQueue = () => {
    if (this.queue.length > 0) {
      this.setState({
        messageInfo: this.queue.shift(),
        open: true,
      })
    }
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({ open: false })
  }

  handleExited = () => {
    this.processQueue()
  }

  render() {
    const {classes} = this.props
    const {message, key, button, onButtonClick, autoHideDuration} = this.state.messageInfo
    return (
      <div>
        <Snackbar
          className={classes.snackbar}
          key={key}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={autoHideDuration}
          onClose={this.handleClose}
          onExited={this.handleExited}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{message}</span>}
          action={[
            button && 
              <Button key="undo" color="primary" size="small" onClick={() => {this.handleClose(); onButtonClick()}}>
                {button}
              </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    )
  }
}

Snackbars.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Snackbars)