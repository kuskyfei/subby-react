import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import SearchIcon from '@material-ui/icons/Search'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import MenuList from '@material-ui/core/MenuList'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Grid from '@material-ui/core/Grid'
import {Link} from 'react-router-dom'

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
    marginRight: 20
  },
  searchInput: {
    color: 'white'
  },

  middleContainer: {
    width: 'auto',
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
  }
})

class Header extends React.Component {
  state = {
    auth: true,
    anchorEl: null
  };

  handleChange = event => {
    this.setState({ auth: event.target.checked })
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  };

  handleClose = () => {
    this.setState({ anchorEl: null })
  };

  componentDidMount () {
  }

  render () {
    const { classes } = this.props
    const { auth, anchorEl } = this.state
    const open = Boolean(anchorEl)

    return (
      <div className={classes.root}>

        {/*
        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={auth} onChange={this.handleChange} aria-label="LoginSwitch" />
            }
            label={auth ? 'Logout' : 'Login'}
          />
        </FormGroup>
        */}
        <AppBar position='static'>
          <Toolbar>

            <div className={classes.leftContainer}>
              <Typography variant='title' color='inherit'>
                <Link to='?p=feed'>
                  <div className='header__logo'>
                    Subby
                  </div>
                </Link>
              </Typography>
            </div>

            <div className={classes.middleContainer}>
              <div className={classes.searchBar}>
                <Grid container alignItems='flex-end' wrap='nowrap'>
                  <Grid item>
                    <SearchIcon className={classes.searchIcon} />
                  </Grid>

                  <Input
                    inputProps={{size: 1}}
                    id='header__search-bar'
                    fullWidth
                    placeholder='Address or Username...'
                    disableUnderline
                    defaultValue=''
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
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup='true'
                  onClick={this.handleMenu}
                  color='inherit'
                >
                  <AccountCircle />
                </IconButton>

                <Menu
                  id='menu-appbar'
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
                  <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                  <MenuItem onClick={this.handleClose}>My account</MenuItem>

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

export default withStyles(styles)(Header)
