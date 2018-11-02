// react redux
import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {bindActionCreators, compose} from 'redux'

// material
import CssBaseline from '@material-ui/core/CssBaseline'
import LinearProgress from '@material-ui/core/LinearProgress'
import withStyles from '@material-ui/core/styles/withStyles'

// components
import {Pages} from '../../components'

// containers
import {Header, Feed, Subscriptions, Settings, Donations} from '../../containers'

// actions
import actions from './reducers/actions'

// css
import './App.css'

// apis
const services = require('../../services')
window.SUBBY_DEBUG_SERVICES = services

// util
const queryString = require('query-string')
const {isRouteChange, getRouteFromUrlParams, isUrlParamsChangeFromProps} = require('./util')
const debug = require('debug')('containers:App')

const styles = theme => {
  window.SUBBY_DEBUG_THEME = theme

  return {
    main: {
      animation: 'fadeIn ease 2s'
    }
  }
}

class App extends Component {
  state = {
    route: () => '',
    isInitializing: true
  }

  componentDidMount() {
    services.onSignerChange(this.init)

    ;(async () => {
      this.handleRouteChange()

      await this.init()

      // services.mockSmartContracts({explicit: true})
      // services.mockSmartContracts()

      debug('mounted')
    })()
  }

  init = async () => {
    debug('init start')

    this.setState({isInitializing: true})
    await services.init()

    const {actions} = this.props

    const address = await services.getAddress()
    this.handleUpdateCache(address)

    if (!address) {
      actions.setAddress(null)
      actions.setProfile(null)
      this.setState({isInitializing: false})
      return
    }
    const profile = await services.getProfile(address)
    actions.setAddress(address)
    actions.setProfile(profile)
    this.setState({isInitializing: false})

    debug('init end', {address, profile})
  }

  handleUpdateCache = (account) => {
    if (this.updateCacheLoop) {
      this.updateCacheLoop.stop()
    }
    this.updateCacheLoop = new services.UpdateCacheLoop(account)
    this.updateCacheLoop.start()
  }

  componentDidUpdate(prevProps) {
    this.handleRouteChange(prevProps)
    this.scrollToTopOnUrlParamsChange(prevProps)
    this.handleUrlParamsChange(prevProps)

    debug('updated')
  }

  componentWillUnmount = (prevProps) => {
    debug('unmount')
  }

  handleRouteChange(prevProps) {
    if (!isRouteChange(this.props, prevProps)) {
      return
    }
    const urlParams = queryString.parse(this.props.location.search)
    const Route = getRouteComponentFromUrlParams(urlParams)
    this.setState({...this.state, route: Route})

    debug('urlParams', urlParams)
    debug('route changed')
  }

  scrollToTopOnUrlParamsChange = (prevProps) => {
    if (isUrlParamsChangeFromProps(this.props, prevProps)) {
      window.scrollTo(0, 0)
    }
  }

  handleUrlParamsChange = (prevProps) => {
    const urlParams = this.props.location.search
    const prevUrlParams = prevProps.location.search
    if (urlParams === prevUrlParams) {
      return
    }

    services.ga.pageView()
  }

  render() {
    const {isInitializing, route: Route} = this.state
    const {headerIsLoading, classes} = this.props

    let isLoading = headerIsLoading
    if (isInitializing) isLoading = true

    return (
      <div>
        <CssBaseline />

        <Header />

        {isLoading &&
          <LinearProgress />
        }

        {!isLoading &&
          <main className={classes.main}>
            <Route />
          </main>
        }
      </div>
    )
  }
}

const getRouteComponentFromUrlParams = (urlParams) => {
  const route = getRouteFromUrlParams(urlParams)

  switch (route) {
    case 'feed':
      return Feed

    case 'subscriptions':
      return Subscriptions

    case 'donations':
      return Donations

    case 'settings':
      return Settings

    case 'help':
      return Pages.Help

    default:
      return Pages.Help
  }
}

const mapStateToProps = state => ({
  headerIsLoading: state.header.isLoading
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

const enhance = compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(App) // eslint-disable-line
