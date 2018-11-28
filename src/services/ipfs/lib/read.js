/* global self */

const getFileTypeFromBuffer = require('file-type')
const debug = require('debug')('services:ipfs:read')
const state = require('./state')

const {
  noProvider,
  arrayBufferToBase64,
  concatTypedArrays,
  typedArrayToArrayBuffer,
  bytesToMbs,
  uint8ArrayToUtf8
} = require('./util')

const getReadableStream = async (ipfsHash) => {
  debug('getReadableStream', ipfsHash)
  if (!state.ipfs) noProvider()

  const stream = await getReadableFileContentStream(ipfsHash)
  return stream
}

const getReadableFileContentStream = (ipfsHash) => {
  debug('getReadableFileContentStream', ipfsHash)
  if (!state.ipfs) noProvider()

  return new Promise((resolve, reject) => {
    const stream = state.ipfs.files.getReadableStream(ipfsHash)

    stream.on('data', (file) => {
      if (file.type === 'dir') return reject(Error(`IPFS hash (${ipfsHash}) is a directory`))

      resolve(file.content)
    })
  })
}

const getFileTypeFromHash = (ipfsHash) => {
  debug('getFileTypeFromHash', ipfsHash)
  if (!state.ipfs) noProvider()

  return new Promise(async resolve => {
    const s = await getReadableStream(ipfsHash)
    s.on('data', buffer => {
      s.pause()
      s.destroy()

      const fileType = getFileTypeFromBuffer(buffer)
      resolve(fileType)
    })
  })
}

const getBase64ImageFromStream = (ipfsHash, progressCallback) => {
  debug('getBase64ImageFromStream', ipfsHash)
  if (!state.ipfs) noProvider()

  return new Promise(async resolve => {
    let entireBuffer

    const s = await getReadableStream(ipfsHash)
    s.on('data', buffer => {
      if (!entireBuffer) {
        entireBuffer = buffer
      } else {
        entireBuffer = concatTypedArrays(entireBuffer, buffer)
      }

      if (progressCallback) {
        const progressResponse = {
          killStream: () => {
            s.pause()
            s.destroy()
          },
          progressInMbs: bytesToMbs(entireBuffer.length)
        }
        progressCallback(progressResponse)
      }
    })

    s.on('end', () => {
      const base64Image = 'data:image/png;base64,' + arrayBufferToBase64(entireBuffer)
      resolve(base64Image)
    })
  })
}

const getBase64Image = async (ipfsHash) => {
  debug('getBase64Image', ipfsHash)
  if (!state.ipfs) noProvider()

  const res = await state.ipfs.get(ipfsHash)

  const buffer = res[0].content

  const base64Image = 'data:image/png;base64,' + arrayBufferToBase64(buffer)

  return base64Image
}

const getTypedArray = async (ipfsHash) => {
  debug('getTypedArray', ipfsHash)
  if (!state.ipfs) noProvider()

  const res = await state.ipfs.get(ipfsHash)

  const typedArray = res[0].content

  return typedArray
}

const getBlob = async (ipfsHash) => {
  debug('getBlob', ipfsHash)
  if (!state.ipfs) noProvider()

  const res = await state.ipfs.get(ipfsHash)

  const buffer = res[0].content

  const typedArray = buffer

  // the typed array need to be converted to an array
  // buffer, which you can do by putting it into an array
  const blob = new window.Blob([typedArray])

  return blob
}

const getBlobFromStream = async (ipfsHash, progressCallback) => {
  debug('getBlobFromStream', ipfsHash)
  if (!state.ipfs) noProvider()

  return new Promise(async resolve => {
    let entireBuffer

    const s = await getReadableStream(ipfsHash)

    s.on('data', buffer => {
      if (!entireBuffer) {
        entireBuffer = buffer
      } else {
        entireBuffer = concatTypedArrays(entireBuffer, buffer)
      }

      if (progressCallback) {
        const progressResponse = {
          killStream: () => {
            s.pause()
            s.destroy()
          },
          progressInMbs: bytesToMbs(entireBuffer.length)
        }
        progressCallback(progressResponse)
      }
    })

    s.on('end', () => {
      const arrayBuffer = typedArrayToArrayBuffer(entireBuffer)
      let blob

      // self is needed to work with the web worker,
      // it might cause bugs when used in other places
      try {
        blob = new self.Blob(arrayBuffer)
      } catch (e) {
        blob = new window.Blob(arrayBuffer)
      }

      resolve(blob)
    })
  })
}

const getJson = async (ipfsHash) => {
  debug('getJson', ipfsHash)
  if (!state.ipfs) noProvider()

  const res = await state.ipfs.get(ipfsHash)

  const buffer = res[0].content

  const utf8Decode = new window.TextDecoder('utf-8')
  const string = utf8Decode.decode(buffer)

  const object = JSON.parse(string)

  return object
}

const getString = async (ipfsHash) => {
  debug('getString', ipfsHash)
  if (!state.ipfs) noProvider()

  const res = await state.ipfs.get(ipfsHash)

  const buffer = res[0].content

  const utf8Decode = new window.TextDecoder('utf-8')
  const string = utf8Decode.decode(buffer)

  return string
}

const getStringFromStream = async (ipfsHash, {maxLength}) => {
  debug('getStringFromStream', ipfsHash)
  if (!state.ipfs) noProvider()

  return new Promise(async resolve => {
    let entireBuffer

    const s = await getReadableStream(ipfsHash)

    s.on('data', buffer => {
      if (!entireBuffer) {
        entireBuffer = buffer
      } else {
        entireBuffer = concatTypedArrays(entireBuffer, buffer)
      }

      if (maxLength && entireBuffer.length > maxLength) {
        resolve(uint8ArrayToUtf8(entireBuffer))
        s.pause()
        s.destroy()
      }
    })

    s.on('end', () => {
      resolve(uint8ArrayToUtf8(entireBuffer))
    })
  })
}

const getMediaSourceFromStream = (ipfsHash, codecs) => {
  /* list of valid codecs:
    'video/webm; codecs="vp8"'
    'video/webm; codecs="vorbis"'
    'video/webm; codecs="vp8, vorbis"'
    'video/webm; codecs="vorbis, vp8"'
    'video/mp4; codecs="avc1.4d001e"'
    'video/mp4; codecs="avc1.42001e"'
    'video/mp4; codecs="mp4a.40.2"'
    'video/mp4; codecs="avc1.4d001e, mp4a.40.2"'
    'video/mp4; codecs="mp4a.40.2, avc1.4d001e"'
    'video/mp4; codecs="avc1.4d001e, mp4a.40.5"'
    'audio/webm; codecs="vorbis"'
    'audio/mp4; codecs="mp4a.40.2"'
    'audio/mp4; codecs="mp4a.40.5"'
    'audio/mp4; codecs="mp4a.67"'
  */
  debug('getMediaSourceFromStream', ipfsHash)
  if (!state.ipfs) noProvider()

  let stream
  const onMediaSourceOpen = async () => {
    const sourceBuffer = mediaSource.addSourceBuffer(codecs)
    stream = await getReadableStream(ipfsHash)

    let pendingBuffer
    let counter = 0
    stream.on('data', buffer => {
      if (!pendingBuffer) {
        pendingBuffer = buffer
      } else {
        pendingBuffer = concatTypedArrays(pendingBuffer, buffer)
      }

      // if the media source is ready, append buffer, otherwise wait
      if (sourceBuffer.updating === false) {
        const tempBuffer = pendingBuffer
        pendingBuffer = null
        sourceBuffer.appendBuffer(tempBuffer)
        debug('getMediaSourceFromStream appendBuffer', tempBuffer)

        // only fetch enough to get a thumbnail, after that pause util play is pressed
        if (counter++ === 50) {
          stream.pause()
        }
      } 
    })

    // sometimes the sourceBuffer is busy updating 
    // when the stream ends, in this case we need to 
    // listen for updateend and append the last pending
    // buffer when done
    stream.on('end', () => {
      sourceBuffer.addEventListener('updateend', () => {
        if (!pendingBuffer) {
          return
        }
        if (sourceBuffer.updating !== false) {
          return
        }
        const tempBuffer = pendingBuffer
        pendingBuffer = null
        sourceBuffer.appendBuffer(tempBuffer)
        debug('getMediaSourceFromStream end appendBuffer', tempBuffer)
      })
    })
  }

  const mediaSource = new MediaSource()
  mediaSource.addEventListener('sourceopen', onMediaSourceOpen)
  const mediaSourceStream = {
    src: window.URL.createObjectURL(mediaSource),
    // play and pause need to be set up like this
    // because they are initalized later
    play: () => stream && stream.resume(),
    pause: () => stream && stream.pause()
  }

  return mediaSourceStream
}

export {
  getMediaSourceFromStream,
  getFileTypeFromBuffer,
  getFileTypeFromHash,
  getJson,
  getString,
  getStringFromStream,
  getBase64Image,
  getBase64ImageFromStream,
  getTypedArray,
  getBlob,
  getBlobFromStream,
  getReadableStream
}
