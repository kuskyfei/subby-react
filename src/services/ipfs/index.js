const {
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
  getMediaSourceFromStream,
  getReadableStream,

  getIpfs
} = require('./lib')

const webWorkers = require('./webWorkers')

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
  getMediaSourceFromStream,
  getReadableStream,

  getIpfs,

  webWorkers
}
