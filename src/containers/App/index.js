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
import {Header, Footer} from '../../components'
import {Feed} from '../../containers'

// actions
import actions from './reducers/actions'

// apis
const services = require('../../services')

// util
const queryString = require('query-string')
const {isRouteChange} = require('../util')

// css
import './App.css'

class App extends Component {
  
  state = {route: Home}

  componentDidMount() {

    ;(async() => {

      const settings = await services.getSettings()

      const address = await services.getAddress()
      const profile = await services.getProfile({address})
      const subscriptions = await services.getSubscriptions(address)

      console.log(this.props)

      const {setAddress, setProfile, setSubscriptions} = this.props.actions
      setAddress(address)
      setProfile(profile)
      setSubscriptions(subscriptions)

      console.log('address', address)
      console.log('profile', profile)
      console.log('subscriptions', subscriptions)

      this.handleRouteChange()

      console.log('mounted')
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

const mapStateToProps = state => ({
  profile: state.profile,
  ethereumAddress: state.ethereumAddress,
  subscriptions: state.subscriptions
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App)) // eslint-disable-line
