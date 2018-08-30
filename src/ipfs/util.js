// this specific buffer module is required to work with ipfs-api module
const ipfsBuffer = require('buffer/').Buffer
const fs = require('fs')

const urlToProviderObject = (url) => {
  let host, port, protocol, remainingUrl

  ;[protocol, remainingUrl] = url.split('://')
  if (!remainingUrl) {
    remainingUrl = url
    protocol = undefined
  }

  ;[host, port] = remainingUrl.split(':')
  host = host || url

  return {host, port, protocol}
}

const objectToIpfsBuffer = (object) => {
  const string = JSON.stringify(object)

  const utf8Encode = new window.TextEncoder('utf-8')
  const arrayBuffer = utf8Encode.encode(string)

  const buffer = ipfsBuffer.from(arrayBuffer)

  return buffer
}

const fileToIpfsBuffer = (path) => {
  const nodeBuffer = fs.readFileSync(path)
  return nodeBuffer
}

const noProvider = () => {
  throw Error(`No IPFS provider! Set provider using ipfs.setProvider('https://infura.io:5001')`)
}

export {urlToProviderObject, objectToIpfsBuffer, fileToIpfsBuffer, noProvider}
