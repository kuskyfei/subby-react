// react
import React from 'react'
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'
// import {bindActionCreators} from 'redux'

// material
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

// buttons
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'

// menu
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

// inputs
import Input from '@material-ui/core/Input'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

// icons
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import SearchIcon from '@material-ui/icons/Search'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ContactSupportIcon from '@material-ui/icons/ContactSupport'
import SettingsIcon from '@material-ui/icons/Settings'
import ListIcon from '@material-ui/icons/List'

// util
const queryString = require('query-string')

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
  },

  searchBar: {
    margin: theme.spacing.unit,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 2,
    paddingTop: 2,
    paddingBottom: 1,
    color: 'white',
    background: 'rgba(255, 255, 255, 0.15)',
    maxWidth: 600,
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.25)'
    }
  },
  searchIcon: {
    marginLeft: 20,
    marginRight: 20,
    [theme.breakpoints.down(325)]: {
      marginLeft: 10,
      marginRight: 10
    }
  },
  searchInput: {
    color: 'white',
    marginRight: 20,
    [theme.breakpoints.down(325)]: {
      marginRight: 10
    }
  },

  middleContainer: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    width: 600
  },
  rightContainer: {
    flex: 1,
    whiteSpace: 'nowrap',
    textAlign: 'right'
  },
  leftContainer: {
    flex: 1,
    [theme.breakpoints.down(600 + theme.spacing.unit * 2 * 2)]: {
      display: 'none'
    }
  },

  menuLink: {
    '&:focus': {
      outline: 'none'
    }
  }
})

class Header extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
    searchBarValue: ''
  }

  handleChange = event => {
    this.setState({ auth: event.target.checked })
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handleSearchBarChange = (e) => {
    this.props.history.push(`?u=${e.target.value}`)
  }

  componentDidMount = () => {

  }

  render () {
    const { classes } = this.props
    const { auth, anchorEl } = this.state
    const open = Boolean(anchorEl)

    // router stuff
    const urlParams = queryString.parse(this.props.location.search)
    const urlUsername = urlParams.u

    return (
      <div className={classes.root}>

        <AppBar position='static'>
          <Toolbar>

            <div className={classes.leftContainer}>
              <Typography variant='title' color='inherit'>
                <div id='header__logo'>
                  <Link to='?p=feed'>
                    Subby
                  </Link>
                </div>
              </Typography>
            </div>

            <div className={classes.middleContainer}>

              <div className={classes.searchBar}>
                <Grid container alignItems='flex-end' wrap='nowrap'>
                  <Grid item>
                    <SearchIcon className={classes.searchIcon} />
                  </Grid>

                  <Input
                    onChange={this.handleSearchBarChange.bind(this)}
                    inputProps={{size: 1}}
                    id='header__search-bar'
                    fullWidth
                    placeholder='Address or Username...'
                    disableUnderline
                    value={urlUsername}
                    className={classes.searchInput}
                  />

                </Grid>
              </div>

            </div>

            {auth && (
              <div className={classes.rightContainer}>

                <Button variant='contained' color='default' className={classes.publishButton}>
                  <span className={classes.publishButtonText}>Publish</span>
                  <CloudUploadIcon className={classes.rightIcon} />
                </Button>

                <IconButton
                  id='header__profile-icon'
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup='true'
                  onClick={this.handleMenu}
                  color='inherit'
                >
                  <AccountCircleIcon />
                </IconButton>

                <Menu
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

                  <Link to='?p=settings'>
                    <MenuItem onClick={this.handleClose}>
                      <ListItemIcon className={classes.icon}>
                        <SettingsIcon />
                      </ListItemIcon>
                      <ListItemText classes={{ primary: classes.primary }} inset primary='Settings' />
                    </MenuItem>
                  </Link>

                  <a href='https://subby.io/help' target='_blank'>
                    <MenuItem onClick={this.handleClose}>
                      <ListItemIcon className={classes.icon}>
                        <ContactSupportIcon />
                      </ListItemIcon>
                      <ListItemText classes={{ primary: classes.primary }} inset primary='Help' />
                    </MenuItem>
                  </a>

                </Menu>

              </div>
            )}

          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({})

export default withRouter( connect(mapStateToProps, mapDispatchToProps)( withStyles(styles)(Header) ) ) // eslint-disable-line
