import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import Card from './Card'

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
      marginBottom: '7.5%',
    }
  },

  container: {
    display: 'inline-block'
  },
  publishButton: {
    margin: theme.spacing.unit
  },
  publishButtonText: {
    [theme.breakpoints.down(1050)]: {
      display: 'none'
    }
  },
  rightIcon: {
    [theme.breakpoints.up(1050)]: {
      marginLeft: theme.spacing.unit
    }
  },
})

const StyledModal = withStyles({
  root: {
    overflow: 'scroll'
  }
})(Modal)

class Publish extends React.Component {
  state = {
    open: false,
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.container}>
        <Button 
          variant='contained' 
          color='default' 
          className={classes.publishButton}
          onClick={this.handleOpen}
        >
          <span className={classes.publishButtonText}>Publish</span>
          <CloudUploadIcon className={classes.rightIcon} />
        </Button>
        <StyledModal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div className={classes.modal}>
            <Card />
          </div>
        </StyledModal>
      </div>
    )
  }
}

Publish.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Publish) // eslint-disable-line