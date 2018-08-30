/* eslint-disable */

import React, { Component } from 'react'
import {Switch, Route, withRouter} from 'react-router-dom'
import {events, init, getBlockNumber} from './ethereum'
import * as ipfs from './ipfs'
import {getTorrent} from './torrent'

ipfs.setProvider(window.SUBBY_GLOBAL_SETTINGS.IPFS_PROVIDER)

// css
import './css/main.css'

class App extends Component {
  state = {events: [], videoSrc: null}

  componentDidMount () {
    // require('./ipfs/test')

    const mimecodec = 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"'
    //const mimecodec = 'video/webm; codecs="vorbis,vp8"'
    if (!MediaSource.isTypeSupported(mimecodec)) alert('mimecodec not supported')

    const mediaSource = new MediaSource()

    this.setState({...this.state, videoSrc: URL.createObjectURL(mediaSource)})

    mediaSource.addEventListener("sourceopen", async () => {

      const sourceBuffer = mediaSource.addSourceBuffer(mimecodec)
      //sourceBuffer.mode = "sequence";
    
      const stream = await ipfs.stream('QmPrg9qm6RPpRTPF9cxHcYBtQKHjjytYEriU37PQpKeJTV')
      let fileType
      stream.on('data', (buffer) => {
        if (!fileType) fileType = ipfs.getFileType(buffer)

        console.log(buffer)

        console.log(sourceBuffer.updating)
        sourceBuffer.appendBuffer(buffer)
        console.log(sourceBuffer.updating)

        stream.pause()

        sourceBuffer.addEventListener("updateend", () => {
          stream.resume()
          //mediaSource.endOfStream()
        })

        console.log(sourceBuffer.buffered)
        
      })

      stream.on('close', () => {
        console.log('CLOSING!')
      })

    })
    
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

        <video controls
          muted
          src={this.state.videoSrc}
          width="300"
          height="200">
        </video>

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

  const file = await ipfs.uploadObject(object)

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
