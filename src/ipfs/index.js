const IPFS = require('ipfs-api')
const getFileType = require('file-type')

let ipfs

const {urlToProviderObject, objectToIpfsBuffer, noProvider, fileToIpfsBuffer} = require('./util')

const setProvider = (provider) => {
  provider = urlToProviderObject(provider)
  ipfs = new IPFS(provider)
}

const uploadObject = async (object) => {
  if (!ipfs) noProvider()

  const buffer = objectToIpfsBuffer(object)
  return ipfs.add(buffer)
}

const uploadBuffer = async (buffer) => {
  if (!ipfs) noProvider()

  return ipfs.add(buffer)
}

const uploadFilePath = (path) => {
  if (!ipfs) noProvider()

  const buffer = fileToIpfsBuffer(path)

  return ipfs.add(buffer)
}

const get = async (ipfsHash) => {
  if (!ipfs) noProvider()

  const res = await ipfs.get(ipfsHash)

  const buffer = res[0].content

  const utf8Decode = new window.TextDecoder('utf-8')
  const string = utf8Decode.decode(buffer)

  const object = JSON.parse(string)

  return object
}

const stream = async (ipfsHash) => {
  const stream = await getReadableFileContentStream(ipfsHash)
  return stream
}

const getReadableFileContentStream = (ipfsHash) => {
  return new Promise((resolve, reject) => {
    const stream = ipfs.files.getReadableStream(ipfsHash)

    stream.on('data', (file) => {
      if (file.type === 'dir') return reject(Error(`IPFS hash (${ipfsHash}) is a directory`))

      resolve(file.content)
    })
  })
}

export {uploadObject, uploadBuffer, uploadFilePath, get, setProvider, stream, getFileType}
