const {
  mockIpfsApi,
  setProvider,
  getIpfs
} = require('./init')

const {
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
  getMediaSourceFromStream
} = require('./read')

const {
  uploadObject,
  uploadString,
  uploadTypedArray,
  uploadIpfsBuffer,
  uploadFilePath,
  uploadIpfsBufferWrappedWithDirectory,
  uploadFilePathWrappedWithDirectory
} = require('./write')

export {
  mockIpfsApi,
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
  getMediaSourceFromStream,

  getIpfs
}
