import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
})

class Snackbars extends React.Component {
  queue = []

  state = {
    open: false,
    messageInfo: {},
  }

  componentDidMount() {
    if (!window.chrome) {
      this.newSnackbar({message: 'Subby might not work properly in non-Chrome based browsers.', autoHideDuration: 15000})
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