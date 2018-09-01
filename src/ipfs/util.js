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

const arrayBufferToBase64 = (buffer) => {
  var binary = ''
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

const concatTypedArrays = (a, b) => {
  var c = new (a.constructor)(a.length + b.length)
  c.set(a, 0)
  c.set(b, a.length)
  return c
}

const fileToIpfsBuffer = (path) => {
  const nodeBuffer = fs.readFileSync(path)
  return nodeBuffer
}

const noProvider = () => {
  throw Error(`No IPFS provider! Set provider using ipfs.setProvider('https://infura.io:5001').`)
}

const typedArrayToArrayBuffer = (typedArray) => {
  return [typedArray]
}

export {
  urlToProviderObject,
  objectToIpfsBuffer,
  fileToIpfsBuffer,
  noProvider,
  arrayBufferToBase64,
  concatTypedArrays,
  typedArrayToArrayBuffer
}
