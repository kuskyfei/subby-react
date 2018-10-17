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
import {Header, Feed, Subscriptions, Settings} from '../../containers'

// actions
import actions from './reducers/actions'

// css
import './App.css'

// apis
const services = require('../../services')
window.SUBBY_DEBUG_SERVICES = services

// util
const queryString = require('query-string')
const {isRouteChange, getRouteFromUrlParams} = require('./util')
const debug = require('debug')('containers:App')

const styles = images => theme => {
  debug(theme)

  return {
    main: {
      animation: 'fadeIn ease 2s'
    }
  }
}

class App extends Component {
  state = {
    route: () => '',
    isInitializing: true,
  }

  componentDidMount () {
    ;(async () => {
      this.handleRouteChange()

      await services.init()
      services.mockSmartContracts()
      this.setState({...this.state, isInitializing: false})

      const settings = await services.getSettings()
      // const address = await services.getAddress()
      const address = '0x1111111111111111111111111111111111111111'
      const profile = await services.getProfile(address)
      const subscriptions = await services.getSubscriptions(address)

      const {setAddress, setProfile, setSubscriptions} = this.props.actions
      setAddress(address)
      setProfile(profile)
      setSubscriptions(subscriptions.activeSubscriptions)

      // // setInterval(() =>
      // //   services.updateCache({address})
      // //   , 10000)

      debug('mounted', {address, profile, subscriptions})
    })()
  }

  componentDidUpdate (prevProps) {
    this.handleRouteChange(prevProps)

    debug('updated')
  }

  componentWillUnmount = (prevProps) => {
    debug('unmount')
  }

  handleRouteChange (prevProps) {
    if (!isRouteChange(this.props, prevProps)) {
      return
    }
    const urlParams = queryString.parse(this.props.location.search)
    const Route = getRouteComponentFromUrlParams(urlParams)
    this.setState({...this.state, route: Route})

    debug('urlParams', urlParams)
    debug('route changed')
  }

  render () {
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

    case 'settings':
      return Settings

    case 'help':
      return Pages.Help

    default:
      return Pages.Help
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  address: state.address,
  subscriptions: state.subscriptions,
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
