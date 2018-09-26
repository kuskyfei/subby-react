/* global postMessage, addEventListener */

const {getBlobFromStream, setProvider} = require('../lib')

let killStream
let streamIsKilled = false

// Respond to message from parent thread
addEventListener('message', async ({data}) => {
  if (data.ipfsHash) {
    setProvider(data.ipfsProvider)

    const blob = await getBlobFromStream(data.ipfsHash, (progressResponse) => {
      if (streamIsKilled) return

      const {progressInMbs} = progressResponse
      killStream = progressResponse.killStream

      // send progress messages to parent thread
      postMessage({progressInMbs})
    })

    // send finished blob to parent thread
    if (streamIsKilled) return
    postMessage({blob})
  }

  if (data.killStream) {
    if (typeof killStream !== 'function') {
      return
    }
    streamIsKilled = true
    killStream()
  }
})
