/* eslint-disable */

import React, { Component } from 'react'
import {Switch, Route, withRouter, Link} from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import idb from 'idb'

import {events, init, getBlockNumber} from './ethereum'
import * as ipfs from './ipfs'
import {getTorrent} from './torrent'
import Layout from './components/Layout'

const queryString = require('query-string')

ipfs.setProvider(window.SUBBY_GLOBAL_SETTINGS.IPFS_PROVIDER)

// css
import './css/main.css'

class App extends Component {
  
  state = {}

  componentDidMount () {

  }

  componentDidUpdate () {
    const parsed = queryString.parse(this.props.location.search)
    console.log('parsed')
    console.log(parsed)
  }

  render () {

    return (
      <div>

        <Switch>

          <Route path='/' component={Layout} />

          {/*
          <Route path='/blocks/' component={Blocks} />
          <Route path='/block/:height/:tab?/' component={Block} />
          <Route path='/txs/' component={Transactions} />
          <Route path='/tx/:hash/:tab?/' component={Transaction} />
          */}

        </Switch>
      </div>
    )
  }
}

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({})

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App)) // eslint-disable-line

export default App
