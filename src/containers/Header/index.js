// react
import React from 'react'
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {compose} from 'redux'
// import {connect} from 'react-redux'

// material
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import SearchIcon from '@material-ui/icons/Search'
import CircularProgress from '@material-ui/core/CircularProgress'

// components
import Publish from '../Publish'
import {Menu} from './components'
import {images} from '../../settings'

import styles from './styles'

// util
const {getUsernameFromUrlParams, onFinishedTyping} = require('./util')

class Header extends React.Component {
  state = {
    searchBarValue: '',
    isTyping: false,
    isLoading: false
  }

  handleSearchBarChange = (e) => {
    const newSearchBarValue = e.target.value

    this.setState({...this.state, isLoading: true, searchBarValue: newSearchBarValue})

    onFinishedTyping.call(this, () => {
      this.props.history.push(`?u=${newSearchBarValue}`)
      this.setState({...this.state, isLoading: false})
    })
  }

  componentDidMount = () => {
    const {location} = this.props
    const urlUsername = getUsernameFromUrlParams(location.search)
    this.setState({...this.state, searchBarValue: urlUsername})
  }

  render () {
    const {classes} = this.props
    const {searchBarValue, isLoading} =  this.state

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
                    value={searchBarValue}
                    className={classes.searchInput}
                  />

                  <Grid className={classes.loadingIcon} item>
                    {isLoading && 
                      <CircularProgress className='{classes.loadingIcon}' size={20} />
                    }
                  </Grid>

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

const enhance = compose(
  withRouter,
  // connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles(images))
)

export default enhance(Header) // eslint-disable-line
