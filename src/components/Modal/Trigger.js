import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

const styles = theme => ({
  modal: {
    position: 'absolute',
    top: '15%',
    left: '50%',
    transform: 'translate(-50%, 0)',
    '&:focus': {
      outline: 'none'
    },
    marginBottom: '15%',
    [theme.breakpoints.down(600)]: {
      top: '7.5%',
      marginBottom: '7.5%'
    },
    [theme.breakpoints.down(450)]: {
      top: '0',
      marginBottom: '0'
    }
  },

  container: {
    display: 'contents'
  },

  closeButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    [theme.breakpoints.up(450)]: {
      display: 'none'
    }
  },
  closeIcon: {
    color: theme.palette.grey['300'],
  }
})

const StyledModal = withStyles({
  root: {
    overflow: 'scroll'
  }
})(Modal)

const StyledIconButton = withStyles({
  root: {
    color: 'rgba(0, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.02)'
    }
  }
})(IconButton)

class Trigger extends React.Component {
  state = {
    open: false
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    const {onClose} = this.props
    if (onClose) onClose()
    this.setState({ open: false })
  }

  componentDidMount = () => {
    window.addEventListener('transaction', this.handleClose)
  }

  componentWillUnmount = () => {
    window.removeEventListener('transaction', this.handleClose)
  }

  render () {
    const {classes, trigger} = this.props

    return (
      <div className={classes.container}>

        <div className={classes.container} onClick={this.handleOpen}>
          {trigger}
        </div>

        <StyledModal
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div className={classes.modal}>
            <StyledIconButton
              className={classes.closeButton}
              onClick={this.handleClose}
            >
              <ArrowBackIcon className={classes.closeIcon}/>
            </StyledIconButton>
            {this.props.children}
          </div>
        </StyledModal>
      </div>
    )
  }
}

Trigger.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Trigger) // eslint-disable-line
