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

const getMediaSourceFromStream = async (ipfsHash, cb) => {
  debug('getMediaSourceFromStream', ipfsHash)
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
      cb(buffer)
    })

    s.on('end', () => {
      const arrayBuffer = typedArrayToArrayBuffer(entireBuffer)

      const blob = new window.Blob(arrayBuffer)

      resolve(blob)
    })
  })
}

module.exports = {
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
