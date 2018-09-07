/* eslint-disable */

// react redux
import React, { Component } from 'react'
import {Switch, Route, withRouter, Link} from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

// material
import withStyles from '@material-ui/core/styles/withStyles'
import CssBaseline from '@material-ui/core/CssBaseline'

// components
import Header from './components/Header'
import Footer from './components/Footer'
import Feed from './components/Feed'

// apis
import {events, init, getBlockNumber} from './ethereum'
import * as ipfs from './ipfs'
//import {getTorrent} from './torrent'

// util
const queryString = require('query-string')
const {isRouteChange} = require('./util')

// init
ipfs.setProvider(window.SUBBY_GLOBAL_SETTINGS.IPFS_PROVIDER)

// css
import './css/main.css'

class App extends Component {
  
  state = {route: Home}

  componentDidMount() {

    const username = await ethereum.getUsername(address)
    const setUsername = this.props.appActions.setEthereumAddress

    const ethereumAddress = await ethereum.getAddress()
    const setEthereumAddress = this.props.appActions.setEthereumAddress

    const subscriptions = await ethereum.getSubscriptions(username, address)
    const setSubscriptions = this.props.appActions.setSubscriptions

    console.log('mounted')

    this.handleRouteChange()

    ;(async() => {

    })()

    const urlParams = queryString.parse(this.props.location.search)
    console.log('url params')
    console.log(urlParams)
  }

  componentDidUpdate(prevProps) {

    console.log('updated')

    this.handleRouteChange(prevProps)

    const urlParams = queryString.parse(this.props.location.search)
    console.log('url params')
    console.log(urlParams)
  }

  handleRouteChange(prevProps) {
    
    if (!isRouteChange(this.props, prevProps)) {
      return
    }
    const urlParams = queryString.parse(this.props.location.search)
    const Route = getRouteFromUrlParams(urlParams)
    this.setState({...this.state, route: Route})
  }

  render () {

    const Route = this.state.route

    return (
      <div>

        <CssBaseline />

        <Header />

        <main>

          <Route />

        </main>

        <Footer />

      </div>
    )
  }
}



const Home = () => ''

const getRouteFromUrlParams = (urlParams) => {

  const page = urlParams.p

  switch (page) {
    case 'feed':
      return Feed

    default:
      return Home
  }
}

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({})

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App)) // eslint-disable-line

export default App
