const IPFS = require('ipfs-api')
const getFileTypeFromBuffer = require('file-type')
const debug = require('debug')('services:ipfs')

let ipfs

const {
  urlToProviderObject,
  typedArrayToIpfsBuffer,
  objectToIpfsBuffer,
  noProvider,
  fileToIpfsBuffer,
  arrayBufferToBase64,
  concatTypedArrays,
  typedArrayToArrayBuffer,
  stringToIpfsBuffer,
  bytesToMbs,
  uint8ArrayToUtf8
} = require('./util')

const setProvider = (provider) => {
  if (!provider) throw Error(`No provider argument passed to ipfs.setProvider. Try something like 'https://infura.io:5001'.`)

  provider = urlToProviderObject(provider)
  ipfs = new IPFS(provider)
}

// useful for mocking
const setIpfsApi = (ipfsApi) => {
  if (!ipfs) noProvider()
  ipfs = {...ipfs, ...ipfsApi}
}

const uploadObject = async (object) => {
  if (!ipfs) noProvider()

  const buffer = objectToIpfsBuffer(object)
  return ipfs.add(buffer)
}

const uploadString = async (string) => {
  debug('uploadString', string)
  if (!ipfs) noProvider()

  const buffer = stringToIpfsBuffer(string)
  return ipfs.add(buffer)
}

const uploadIpfsBuffer = async (ipfsBuffer) => {
  if (!ipfs) noProvider()

  // IPFS buffers are special types of buffers that need a conversion
  return ipfs.add(ipfsBuffer)
}

const uploadTypedArray = async (typedArray) => {
  debug('uploadTypedArray', typedArray)
  if (!ipfs) noProvider()

  const buffer = typedArrayToIpfsBuffer(typedArray)
  return ipfs.add(buffer)
}

const uploadIpfsBufferWrappedWithDirectory = async (fileName, buffer) => {
  if (!ipfs) noProvider()

  const data = [{
    path: fileName,
    content: buffer
  }]

  return ipfs.add(data, {wrapWithDirectory: true})
}

const uploadFilePath = (path) => {
  if (!ipfs) noProvider()

  const buffer = fileToIpfsBuffer(path)

  return ipfs.add(buffer)
}

const uploadFilePathWrappedWithDirectory = (fileName, path) => {
  if (!ipfs) noProvider()

  const buffer = fileToIpfsBuffer(path)

  const files = [{
    path: fileName,
    content: buffer
  }]

  return ipfs.add(files, {wrapWithDirectory: true})
}

const getReadableStream = async (ipfsHash) => {
  debug('getReadableStream', ipfsHash)
  if (!ipfs) noProvider()

  const stream = await getReadableFileContentStream(ipfsHash)
  return stream
}

const getReadableFileContentStream = (ipfsHash) => {
  debug('getReadableFileContentStream', ipfsHash)
  if (!ipfs) noProvider()

  return new Promise((resolve, reject) => {
    const stream = ipfs.files.getReadableStream(ipfsHash)

    stream.on('data', (file) => {
      if (file.type === 'dir') return reject(Error(`IPFS hash (${ipfsHash}) is a directory`))

      resolve(file.content)
    })
  })
}

const getFileTypeFromHash = (ipfsHash) => {
  debug('getFileTypeFromHash', ipfsHash)
  if (!ipfs) noProvider()

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
  if (!ipfs) noProvider()

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
  if (!ipfs) noProvider()

  const res = await ipfs.get(ipfsHash)

  const buffer = res[0].content

  const base64Image = 'data:image/png;base64,' + arrayBufferToBase64(buffer)

  return base64Image
}

const getTypedArray = async (ipfsHash) => {
  debug('getTypedArray', ipfsHash)
  if (!ipfs) noProvider()

  const res = await ipfs.get(ipfsHash)

  const typedArray = res[0].content

  return typedArray
}

const getBlob = async (ipfsHash) => {
  debug('getBlob', ipfsHash)
  if (!ipfs) noProvider()

  const res = await ipfs.get(ipfsHash)

  const buffer = res[0].content

  const typedArray = buffer

  // the typed array need to be converted to an array
  // buffer, which you can do by putting it into an array
  const blob = new window.Blob([typedArray])

  return blob
}

const getBlobFromStream = async (ipfsHash, progressCallback) => {
  debug('getBlobFromStream', ipfsHash)
  if (!ipfs) noProvider()

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
      const blob = new window.Blob(arrayBuffer)
      resolve(blob)
    })
  })
}

const getJson = async (ipfsHash) => {
  debug('getJson', ipfsHash)
  if (!ipfs) noProvider()

  const res = await ipfs.get(ipfsHash)

  const buffer = res[0].content

  const utf8Decode = new window.TextDecoder('utf-8')
  const string = utf8Decode.decode(buffer)

  const object = JSON.parse(string)

  return object
}

const getString = async (ipfsHash) => {
  debug('getString', ipfsHash)
  if (!ipfs) noProvider()

  const res = await ipfs.get(ipfsHash)

  const buffer = res[0].content

  const utf8Decode = new window.TextDecoder('utf-8')
  const string = utf8Decode.decode(buffer)

  return string
}

const getStringFromStream = async (ipfsHash, {maxLength}) => {
  debug('getStringFromStream', ipfsHash)
  if (!ipfs) noProvider()

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

// use this to call the ipfs methods directly
const getIpfs = () => ipfs

export default {
  setIpfsApi,
  setProvider,

  uploadObject,
  uploadString,
  uploadTypedArray,
  uploadIpfsBuffer,
  uploadFilePath,
  uploadIpfsBufferWrappedWithDirectory,
  uploadFilePathWrappedWithDirectory,

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

  getReadableStream,
  getIpfs
}
