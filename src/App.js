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
  state = {events: [], imgSrc: null, videoSrc: null}

  componentDidMount () {
    
    (async() => {
      //const image = await ipfs.getBase64Image('QmeeogFMkaWi3n1hurdMXLuAHjG2tSaYfFXvXqP6SPd1zo')
      //const image = await ipfs.getFileTypeFromHash('QmeeogFMkaWi3n1hurdMXLuAHjG2tSaYfFXvXqP6SPd1zo')
      //console.log(image)
      //this.setState({...this.state, imgSrc: image})

      // const video = await ipfs.getVideo('QmPrg9qm6RPpRTPF9cxHcYBtQKHjjytYEriU37PQpKeJTV')

      // console.log(video)

      // const blob = new Blob([video])
      // console.log(blob)

      const blob = await ipfs.getBlobFromStream('QmQ747r7eLfsVtBFBSRwfXsPK6tADJpQzJxz4uFdoZb9XJ')

      const url = URL.createObjectURL(blob)
      this.setState({...this.state, videoSrc: url})

      // const image = await ipfs.getVideo('QmeeogFMkaWi3n1hurdMXLuAHjG2tSaYfFXvXqP6SPd1zo')
      // console.log([image])

      // const blob = new Blob([image])
      // console.log(blob)

      // const url = URL.createObjectURL(blob)
      // this.setState({...this.state, imgSrc: url})

      // var inputElement = document.querySelector('input');
      // var imgElement = document.querySelector('img');
      // var videoElement = document.querySelector('video');

      // inputElement.addEventListener('change', function() {

      //   console.log(inputElement.files[0])

      //   var reader = new FileReader();

      //   reader.onload = function(e) {
      //     var res = reader.result;
      //     console.log(res)
          
      //     const blob = new Blob([res])

      //     console.log(blob)

      //     var url = URL.createObjectURL(blob)
      //     videoElement.src = url;
      //   }

      //   reader.readAsArrayBuffer(inputElement.files[0]);

      // });

    })()

    // (async() => {
    //   const buffer = await ipfs.get('QmeeogFMkaWi3n1hurdMXLuAHjG2tSaYfFXvXqP6SPd1zo')
    //   console.log(buffer)
    // })()
    /*
    (async () => {
      const stream = await ipfs.stream('QmeeogFMkaWi3n1hurdMXLuAHjG2tSaYfFXvXqP6SPd1zo')
    
      let fileType, streamClosed, fileBuffer
      
      stream.on('data', (buffer) => {

        if (!fileType) fileType = ipfs.getFileType(buffer)

        if (!fileBuffer) {
          stream.pause()
          fileBuffer = buffer
          stream.resume()
        }
        else {
          stream.pause()
          fileBuffer = concatTypedArrays(fileBuffer, buffer)
          stream.resume()
        }
        
      })

      stream.on('end', () => {
        streamClosed = true

        const blob = new Blob(fileBuffer)
        const url = URL.createObjectURL(blob)
        console.log(fileBuffer)
        console.log(blob)

        this.setState({...this.state, videoSrc: url})

        //browser.downloads.download({url: URL.createObjectURL(blob), filename: 'test.mp4'})

        var a = document.createElement('a');
        a.download = "test.jpg";
        a.href = url;
        a.textContent = "Download backup.txt";
        a.click();
      })

    })()
*/
    
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

        <video controls src={this.state.videoSrc} />

        <img src={this.state.imgSrc} />

        <input type="file" />

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
