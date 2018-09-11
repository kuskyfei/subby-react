// react redux
import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// material
import CssBaseline from '@material-ui/core/CssBaseline'

// components
import {Header, Footer} from '../../components'
import {Feed} from '../../containers'

// actions
import actions from './reducers/actions'

// css
import './App.css'

// apis
const services = require('../../services')

// util
const queryString = require('query-string')
const {isRouteChange} = require('../util')
const debug = require('debug')('containers:App')

class App extends Component {
  state = {route: Home}

  componentDidMount () {
    ;(async () => {
      await services.init()

      // const settings = await services.getSettings()

      const address = await services.getAddress()
      const profile = await services.getProfile({address})
      const subscriptions = await services.getSubscriptions({address})

      const {setAddress, setProfile, setSubscriptions} = this.props.actions
      setAddress(address)
      setProfile(profile)
      setSubscriptions(subscriptions)

      this.handleRouteChange()

      debug('props', this.props)
      debug('address', address)
      debug('profile', profile)
      debug('subscriptions', subscriptions)
      debug('mounted')
    })()
  }

  componentDidUpdate (prevProps) {
    this.handleRouteChange(prevProps)

    debug('updated')
  }

  handleRouteChange (prevProps) {
    if (!isRouteChange(this.props, prevProps)) {
      return
    }
    const urlParams = queryString.parse(this.props.location.search)
    const Route = getRouteFromUrlParams(urlParams)
    this.setState({...this.state, route: Route})

    debug('urlParams', urlParams)
    debug('route changed')
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