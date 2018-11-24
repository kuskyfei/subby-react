const debug = require('debug')('services:ipfs:write')
const state = require('./state')

const {
  typedArrayToIpfsBuffer,
  objectToIpfsBuffer,
  noProvider,
  fileToIpfsBuffer,
  stringToIpfsBuffer
} = require('./util')

const uploadIpfsBuffer = async (ipfsBuffer) => {
  if (!state.ipfs) noProvider()

  // IPFS buffers are special types of buffers that need a conversion
  const res = await state.ipfs.add(ipfsBuffer)
  const ipfsHash = res[0].hash
  return ipfsHash
}

const uploadObject = async (object) => {
  if (!state.ipfs) noProvider()
  const buffer = objectToIpfsBuffer(object)
  return uploadIpfsBuffer(buffer)
}

const uploadString = async (string) => {
  debug('uploadString', string)
  if (!state.ipfs) noProvider()

  const buffer = stringToIpfsBuffer(string)
  return uploadIpfsBuffer(buffer)
}

const uploadTypedArray = async (typedArray) => {
  debug('uploadTypedArray', typedArray)
  if (!state.ipfs) noProvider()

  const buffer = typedArrayToIpfsBuffer(typedArray)
  return uploadIpfsBuffer(buffer)
}

const uploadFilePath = (path) => {
  if (!state.ipfs) noProvider()

  const buffer = fileToIpfsBuffer(path)
  return uploadIpfsBuffer(buffer)
}

const uploadIpfsBufferWrappedWithDirectory = async (fileName, buffer) => {
  if (!state.ipfs) noProvider()

  const data = [{
    path: fileName,
    content: buffer
  }]

  return state.ipfs.add(data, {wrapWithDirectory: true})
}

const uploadFilePathWrappedWithDirectory = (fileName, path) => {
  if (!state.ipfs) noProvider()

  const buffer = fileToIpfsBuffer(path)

  const files = [{
    path: fileName,
    content: buffer
  }]

  return state.ipfs.add(files, {wrapWithDirectory: true})
}

export {
  uploadObject,
  uploadString,
  uploadTypedArray,
  uploadIpfsBuffer,
  uploadFilePath,
  uploadIpfsBufferWrappedWithDirectory,
  uploadFilePathWrappedWithDirectory
}
