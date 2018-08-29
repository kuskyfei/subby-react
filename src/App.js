/* eslint-disable */

import React, { Component } from 'react'
import {Switch, Route, withRouter} from 'react-router-dom'
import {events, init, getBlockNumber} from './ethereum'
import ipfs from './ipfs'
import {getTorrent} from './torrent'

// css
import './css/main.css'

class App extends Component {
  state = {events: []}

  componentDidMount () {
    if (5 === 4) {}

    // (async () => {
    //   console.log('torrent')
    //   const torrent = await getTorrent('magnet:?xt=urn:btih:01248a3918e25462e9d1730809384027e8820275&dn=test-file.txt&tr=wss%3A%2F%2Ftracker.btorrent.xyz')
    //   console.log('torrent2')
    //   console.log(torrent)
    // })()
    // startIpfs()
    // startEvents(this)
  }

  render () {
    // console.log(this.state.events)

    const events = []
    for (const event of this.state.events) {
      events.push(<p>{JSON.stringify(event)}</p>)
    }

    return (
      <div>
        <p className='App'>Awesome App!</p>
        <Switch>

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

const startIpfs = async () => {
  const object = {
    title: `I'm doing well!`,
    content: `This is my content yo!!!!`
  }

  const file = await ipfs.upload(object)

  console.log(file)

  const content = await ipfs.get('QmRhkA5WautUcDYm2FSSPnRd9S3jnJmrLGbT9dKCN7rgpt')

  console.log(content)
}

const startEvents = async (app) => {
  let counter = 10
  while (counter--) {
    startEvent(app, counter)
  }
}

const startEvent = async (app, i) => {
  try {
    await init() // init ethereum

    const prevBlocks = 10000
    const lastestBlock = await getBlockNumber()
    const fromBlock = lastestBlock - prevBlocks

    const address = '0xcc13fc627effd6e35d2d2706ea3c4d7396c610ea'

    const options = { fromBlock, toBlock: lastestBlock, address }

    console.log(options)

    // run this code for every event in the previous blocks
    events.on(options, async (event) => {
      const newEvents = [...app.state.events, event]

      app.setState({...app.state, events: newEvents})
    })
  } catch (e) { console.log(e) }
}

export default App
