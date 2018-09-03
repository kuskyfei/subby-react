import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  appBar: {
    position: 'relative'
  }
})

class Header extends React.Component {
  render () {
    const { classes } = this.props

    return (
      <AppBar position='absolute' color='default' className={classes.appBar}>
        <Toolbar>

          <div className="header__logo">
            <Typography variant='title' color='inherit' noWrap>
              Subby
            </Typography>
          </div>
          
        </Toolbar>
      </AppBar>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Header)
