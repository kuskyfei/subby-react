// react
import React from 'react'
import {Link} from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'

// menu
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import MaterialMenu from '@material-ui/core/Menu'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

// icons
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ContactSupportIcon from '@material-ui/icons/ContactSupport'
import SettingsIcon from '@material-ui/icons/Settings'
import ListIcon from '@material-ui/icons/List'
import HomeIcon from '@material-ui/icons/Home'
import ModeComment from '@material-ui/icons/ModeComment'

const styles = theme => ({
  menuLink: {
    '&:focus': {
      outline: 'none'
    }
  },
  menuContainer: {
    display: 'contents'
  }
})

class Menu extends React.Component {
  state = {
    anchorEl: null
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  render () {
    const { classes } = this.props
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)

    return (
      <div className={classes.menuContainer}>

        <IconButton
          id='header__profile-icon'
          aria-owns={open ? 'menu-appbar' : null}
          aria-haspopup='true'
          onClick={this.handleMenu}
          color='inherit'
        >
          <AccountCircleIcon />
        </IconButton>

        <MaterialMenu
          id='header__profile-icon__menu'
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={open}
          onClose={this.handleClose}
        >
          <Link className={classes.menuLink} to='?p=feed'>
            <MenuItem onClick={this.handleClose}>
              <ListItemIcon className={classes.icon}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary='Feed' />
            </MenuItem>
          </Link>

          <Link className={classes.menuLink} to='?p=profile'>
            <MenuItem onClick={this.handleClose}>
              <ListItemIcon className={classes.icon}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary='Profile' />
            </MenuItem>
          </Link>

          <Link to='?p=subscriptions'>
            <MenuItem onClick={this.handleClose}>
              <ListItemIcon className={classes.icon}>
                <ListIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary='Subscriptions' />
            </MenuItem>
          </Link>

          <Link to='?p=donations'>
            <MenuItem onClick={this.handleClose}>
              <ListItemIcon className={classes.icon}>
                <ModeComment />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary='Donations' />
            </MenuItem>
          </Link>

          <Link to='?p=settings'>
            <MenuItem onClick={this.handleClose}>
              <ListItemIcon className={classes.icon}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary='Settings' />
            </MenuItem>
          </Link>

          <Link to='?p=help'>
            <MenuItem onClick={this.handleClose}>
              <ListItemIcon className={classes.icon}>
                <ContactSupportIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary='Help' />
            </MenuItem>
          </Link>
        </MaterialMenu>

      </div>
    )
  }
}

export default withStyles(styles)(Menu) // eslint-disable-line
