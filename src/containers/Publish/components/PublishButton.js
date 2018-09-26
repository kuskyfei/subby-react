import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'

const styles = theme => ({
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
  }
})

class PublishButton extends React.Component {
  render () {
    const { classes } = this.props

    return (
      <Button
        variant='contained'
        color='default'
        className={classes.publishButton}
        onClick={this.handleOpen}
      >
        <span className={classes.publishButtonText}>Publish</span>
        <CloudUploadIcon className={classes.rightIcon} />
      </Button>
    )
  }
}

PublishButton.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(PublishButton) // eslint-disable-line