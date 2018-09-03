import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 8,
    padding: `${theme.spacing.unit * 6}px 0`
  }
})

class Footer extends React.Component {
  render () {
    const { classes } = this.props

    return (
      <footer className={classes.footer}>
        <Typography variant='title' align='center' gutterBottom>
          Footer
        </Typography>
        <Typography variant='subheading' align='center' color='textSecondary' component='p'>
          Something here to give the footer a purpose!
        </Typography>
      </footer>
    )
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Footer)
