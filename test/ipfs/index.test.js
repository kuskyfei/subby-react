/* eslint-env jest */

import {
  setIpfsApi,
  setProvider,

  uploadObject,
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
} from '../../src/ipfs'

import ipfsApiMock from '../mocks/ipfs'

const fs = require('fs')

describe('ipfs', () => {
  beforeAll(() => {
    setProvider(window.SUBBY_GLOBAL_SETTINGS.IPFS_PROVIDER)
    setIpfsApi(ipfsApiMock)
  })

  afterAll(() => {

  })

  test('uploadObject', async () => {
    const res = await uploadObject({test: 'test'})
    expect(res).toEqual('test hash')
  })

  test('uploadBuffer', async () => {
    const buffer = Buffer.from('test')
    const res = await uploadBuffer(buffer)
    expect(res).toEqual('test hash')
  })

  test('uploadFilePath', async () => {
    const res = await uploadFilePath('./package.json')
    expect(res).toEqual('test hash')
  })

  test('uploadBufferWrappedWithDirectory', async () => {
    const buffer = Buffer.from('test')
    const res = await uploadBufferWrappedWithDirectory('filename.txt', buffer)
    expect(res).toEqual('test hash')
  })

  test('uploadFilePathWrappedWithDirectory', async () => {
    const res = await uploadFilePathWrappedWithDirectory('filename.txt', './package.json')
    expect(res).toEqual('test hash')
  })

  test('getFileTypeFromBuffer', async () => {
    const buffer = fs.readFileSync(__dirname + '/../mocks/ipfs/media/images/dog-in-fence.jpg')
    const res = await getFileTypeFromBuffer(buffer)
    expect(res).toEqual({ ext: 'jpg', mime: 'image/jpeg' })
  })

})
