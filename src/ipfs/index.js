const IPFS = require('ipfs-api')
const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})
const Buffer = require('buffer/').Buffer

const toIpfsBuffer = (object) => {
  const string = JSON.stringify(object)

  const utf8Encode = new window.TextEncoder('utf-8')
  const arrayBuffer = utf8Encode.encode(string)

  const buffer = Buffer.from(arrayBuffer)

  return buffer
}

const upload = async (object) => {
  const buffer = toIpfsBuffer(object)
  return ipfs.add(buffer)
}

const get = async (ipfsHash) => {
  const res = await ipfs.get(ipfsHash)

  const buffer = res[0].content

  const utf8Decode = new window.TextDecoder('utf-8')
  const string = utf8Decode.decode(buffer)

  const object = JSON.parse(string)

  return object
}

export default {upload, get: get}
