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
import idb from 'idb'
import {events, init, getBlockNumber} from './ethereum'
import * as ipfs from './ipfs'
import {getTorrent} from './torrent'

// util
const queryString = require('query-string')

// init
ipfs.setProvider(window.SUBBY_GLOBAL_SETTINGS.IPFS_PROVIDER)

// css
import './css/main.css'

class App extends Component {
  
  state = {}

  componentDidMount () {
    (async() => {

    })()
    const parsed = queryString.parse(this.props.location.search)
    console.log('parsed')
    console.log(parsed)
  }

  componentDidUpdate () {
    const parsed = queryString.parse(this.props.location.search)
    console.log('parsed')
    console.log(parsed)
  }

  render () {

    return (
      <div>

        <CssBaseline />

        <Header />

        <main>

          <Switch>
            
            {/*
            <Route path='/' component={Feed} />
            */}

            {/*
            <Route path='/blocks/' component={Blocks} />
            <Route path='/block/:height/:tab?/' component={Block} />
            <Route path='/txs/' component={Transactions} />
            <Route path='/tx/:hash/:tab?/' component={Transaction} />
            */}

          </Switch>

        </main>

        <a className="mycoolthing">sup</a>

        <Footer />

      </div>
    )
  }
}

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({})

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App)) // eslint-disable-line

export default App
