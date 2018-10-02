/* eslint-env jest */

const ipfs = require('../../ipfs')
const ipfsApiMock = require('./mock')

const path = require('path')
const fs = require('fs')

describe('ipfs', () => {
  beforeAll(() => {
    ipfs.setProvider(window.SUBBY_GLOBAL_SETTINGS.IPFS_PROVIDER)
    ipfs.mockIpfsApi(ipfsApiMock)
  })

  test('uploadObject', async () => {
    const res = await ipfs.uploadObject({test: 'test'})
    expect(res).toEqual('test hash')
  })

  test('uploadString', async () => {
    const res = await ipfs.uploadString('test')
    expect(res).toEqual('test hash')
  })

  test('uploadBuffer', async () => {
    const buffer = Buffer.from('test')
    const res = await ipfs.uploadIpfsBuffer(buffer)
    expect(res).toEqual('test hash')
  })

  test('uploadFilePath', async () => {
    const res = await ipfs.uploadFilePath('./package.json')
    expect(res).toEqual('test hash')
  })

  test('uploadBufferWrappedWithDirectory', async () => {
    const buffer = Buffer.from('test')
    const res = await ipfs.uploadIpfsBufferWrappedWithDirectory('filename.txt', buffer)
    expect(res).toEqual('test hash')
  })

  test('uploadFilePathWrappedWithDirectory', async () => {
    const res = await ipfs.uploadFilePathWrappedWithDirectory('filename.txt', './package.json')
    expect(res).toEqual('test hash')
  })

  test('getFileTypeFromBuffer', async () => {
    const mediaPath = path.join(__dirname, '/mock/media/images/dog-in-fence.jpg')
    const buffer = fs.readFileSync(mediaPath)
    const res = await ipfs.getFileTypeFromBuffer(buffer)
    expect(res).toEqual({ ext: 'jpg', mime: 'image/jpeg' })
  })
})
