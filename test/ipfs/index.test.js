/* eslint-env jest */

import {
  setIpfsApi,
  setProvider,

  uploadObject,
  uploadString,
  uploadBuffer,
  uploadFilePath,
  uploadBufferWrappedWithDirectory,
  uploadFilePathWrappedWithDirectory,

  getFileTypeFromBuffer,
  getFileTypeFromHash, // eslint-disable-line

  getJson, // eslint-disable-line
  getBase64Image, // eslint-disable-line
  getBase64ImageFromStream, // eslint-disable-line
  getTypedArray, // eslint-disable-line
  getBlob, // eslint-disable-line
  getBlobFromStream, // eslint-disable-line

  getReadableStream, // eslint-disable-line
  getIpfs // eslint-disable-line
} from '../../src/ipfs'

import ipfsApiMock from '../mocks/ipfs'

const path = require('path')

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

  test('uploadString', async () => {
    const res = await uploadString('test')
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
    const mediaPath = path.join(__dirname, '/../mocks/ipfs/media/images/dog-in-fence.jpg')
    const buffer = fs.readFileSync(mediaPath)
    const res = await getFileTypeFromBuffer(buffer)
    expect(res).toEqual({ ext: 'jpg', mime: 'image/jpeg' })
  })
})
