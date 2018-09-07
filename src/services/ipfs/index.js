const IPFS = require('ipfs-api')
const getFileTypeFromBuffer = require('file-type')

let ipfs

const {
  urlToProviderObject,
  objectToIpfsBuffer,
  noProvider,
  fileToIpfsBuffer,
  arrayBufferToBase64,
  concatTypedArrays,
  typedArrayToArrayBuffer,
  stringToIpfsBuffer
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
  if (!ipfs) noProvider()

  const buffer = stringToIpfsBuffer(string)
  return ipfs.add(buffer)
}

const uploadBuffer = async (buffer) => {
  if (!ipfs) noProvider()

  return ipfs.add(buffer)
}

const uploadBufferWrappedWithDirectory = async (fileName, buffer) => {
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
  if (!ipfs) noProvider()
  const stream = await getReadableFileContentStream(ipfsHash)
  return stream
}

const getReadableFileContentStream = (ipfsHash) => {
  if (!ipfs) noProvider()
  return new Promise((resolve, reject) => {
    const stream = ipfs.files.getReadableStream(ipfsHash)

    stream.on('data', (file) => {
      if (file.type === 'dir') return reject(Error(`IPFS hash (${ipfsHash}) is a directory`))

      resolve(file.content)
    })
  })
}

const getFileTypeFromHash = (hash) => {
  if (!ipfs) noProvider()

  return new Promise(async resolve => {
    const s = await getReadableStream(hash)
    s.on('data', buffer => {
      s.pause()
      s.destroy()

      const fileType = getFileTypeFromBuffer(buffer)
      resolve(fileType)
    })
  })
}

const getBase64ImageFromStream = (hash) => {
  if (!ipfs) noProvider()
  return new Promise(async resolve => {
    let entireBuffer

    const s = await getReadableStream(hash)
    s.on('data', buffer => {
      if (!entireBuffer) {
        entireBuffer = buffer
      } else {
        entireBuffer = concatTypedArrays(entireBuffer, buffer)
      }
    })

    s.on('end', () => {
      const base64Image = 'data:image/png;base64,' + arrayBufferToBase64(entireBuffer)
      resolve(base64Image)
    })
  })
}

const getBase64Image = async (hash) => {
  if (!ipfs) noProvider()

  const res = await ipfs.get(hash)

  const buffer = res[0].content

  const base64Image = 'data:image/png;base64,' + arrayBufferToBase64(buffer)

  return base64Image
}

const getTypedArray = async (hash) => {
  if (!ipfs) noProvider()

  const res = await ipfs.get(hash)

  const typedArray = res[0].content

  return typedArray
}

const getBlob = async (hash) => {
  if (!ipfs) noProvider()

  const res = await ipfs.get(hash)

  const buffer = res[0].content

  const typedArray = buffer

  // the typed array need to be converted to an array
  // buffer, which you can do by putting it into an array
  const blob = new window.Blob([typedArray])

  return blob
}

const getBlobFromStream = async (hash) => {
  if (!ipfs) noProvider()

  return new Promise(async resolve => {
    let entireBuffer

    const s = await getReadableStream(hash)

    s.on('data', buffer => {
      if (!entireBuffer) {
        entireBuffer = buffer
      } else {
        entireBuffer = concatTypedArrays(entireBuffer, buffer)
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
  if (!ipfs) noProvider()

  const res = await ipfs.get(ipfsHash)

  const buffer = res[0].content

  const utf8Decode = new window.TextDecoder('utf-8')
  const string = utf8Decode.decode(buffer)

  const object = JSON.parse(string)

  return object
}

// use this to call the ipfs methods directly
const getIpfs = () => ipfs

export {
  setIpfsApi,
  setProvider,

  uploadObject,
  uploadString,
  uploadBuffer,
  uploadFilePath,
  uploadBufferWrappedWithDirectory,
  uploadFilePathWrappedWithDirectory,

  getFileTypeFromBuffer,
  getFileTypeFromHash,

  getJson,
  getBase64Image,
  getBase64ImageFromStream,
  getTypedArray,
  getBlob,
  getBlobFromStream,

  getReadableStream,
  getIpfs
}
