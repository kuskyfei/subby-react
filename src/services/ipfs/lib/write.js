const debug = require('debug')('services:ipfs:write')
const state = require('./state')

const {
  typedArrayToIpfsBuffer,
  objectToIpfsBuffer,
  noProvider,
  fileToIpfsBuffer,
  stringToIpfsBuffer
} = require('./util')

const uploadIpfsBuffer = async (ipfsBuffer, progressCb = () => {}) => {
  if (!state.ipfs) noProvider()

  // IPFS buffers are special types of buffers that need a conversion
  // for some unkown reason progress is not available in infura
  // const res = await state.ipfs.add(ipfsBuffer, {progress: progressCb})
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

const uploadTypedArray = async (typedArray, progressCb) => {
  debug('uploadTypedArray', typedArray)
  if (!state.ipfs) noProvider()

  const buffer = typedArrayToIpfsBuffer(typedArray)
  return uploadIpfsBuffer(buffer, progressCb)
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
