import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'

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
    }
  },

  container: {
    display: 'contents'
  }
})

const StyledModal = withStyles({
  root: {
    overflow: 'scroll'
  }
})(Modal)

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
  }

  componentWillUnmount = () => {
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
