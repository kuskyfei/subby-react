// react
import React from 'react'
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
// import {connect} from 'react-redux'

// material
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import SearchIcon from '@material-ui/icons/Search'

import {images} from '../../settings'

// components
import Publish from '../Publish'
import {Menu} from './components'

import styles from './styles'

// util
const {getUsernameFromUrlParams} = require('./util')

class Header extends React.Component {
  state = {
    searchBarValue: ''
  }

  handleSearchBarChange = (e) => {
    this.props.history.push(`?u=${e.target.value}`)
  }

  componentDidMount = () => {

  }

  render () {
    const { classes, location } = this.props
    const urlUsername = getUsernameFromUrlParams(location.search)

    return (
      <div className={classes.root}>

        <AppBar position='static'>
          <Toolbar>

            <div className={classes.leftContainer}>
              <Link to='?p=feed'>
                <div className={classes.logo} />
              </Link>
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

            <div className={classes.rightContainer}>
              <Publish />
              <Menu />
            </div>

          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
}

// const mapStateToProps = state => ({})
// const mapDispatchToProps = dispatch => ({})

export default withRouter(withStyles(styles(images))(Header)) // eslint-disable-line
