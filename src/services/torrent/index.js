const parseTorrent = require('parse-torrent')
const debug = require('debug')('services:torrent')
const {getRoot, bytesToMbs, isWebSocket, getMediaIndexesFromTorrentFiles, concatTypedArrays, downloadBlob, isStreamableVideo} = require('./util')

let WebTorrent = require('webtorrent')
const mockWebTorrent = () => {
  WebTorrent = function () {
    this.add = () => {}
    this.get = () => {}
  }
}

let client
const init = () => {
  client = new WebTorrent()
  window.SUBBY_DEBUG_TORRENT = client
}

const getTorrent = async (input) => {
  // input can be an info hash, torrent file buffer (blob in browser) or magnet uri
  debug('getTorrent', input)

  // torrent is a global that gets replaced 
  // when a torrent is restarted
  let torrent
  const torrentGetter = () => torrent
  const fileGetter = (fileIndex) => torrent.files[fileIndex]

  torrent = client.get(input, {path: input})

  if (!torrent) {
    torrent = await addAsync(input)
  }
  if (torrent.destroyed) {
    torrent = client.add(input, {path: input})
  }

  // static
  const {infoHash, magnetURI: magnet, length: size} = torrent
  const files = []
  let hasStreamableFiles = false
  for (const file of torrent.files) {
    files.push(file.path)
    if (isStreamableVideo(file.path)) {
      hasStreamableFiles = true
    }
  }
  const fileIsStreamable = (fileIndex) => {
    return isStreamableVideo(files[fileIndex])
  }

  // dynamic
  const stop = () => torrentGetter().destroy()
  // restart (in conjunction with torrentGetter) allows the 
  // original torrent object to change when restarted
  // this is necessary for dynamic values like progress
  let isRestarting
  const restart = () => new Promise(resolve => {
    if (isRestarting) {
      console.error('torrent already restarting')
      return
    }
    isRestarting = true
    torrent = client.add(input, {path: input})
    torrent.on('ready', () => {
      isRestarting = false
      resolve()
    })
  })
  const getStatus = () => ({
    progress: torrentGetter().progress,
    timeRemaining: torrentGetter().timeRemaining,
    peerCount: torrentGetter()._peersLength,
    downloadSpeed: getDownloadSpeed(torrentGetter()),
    uploadSpeed: getUploadSpeed(torrentGetter()),
    done: torrentGetter().done,
    stopped: torrentGetter().destroyed,
  })
  const addToElement = (cssSelector, fileIndex) => addTorrentMediaToElement(torrentGetter(), cssSelector, fileIndex)
  const downloadFile = async (fileIndex) => {
    const fileName = fileGetter(fileIndex).name
    console.log(fileName)
    const blob = await new Promise(resolve => fileGetter(fileIndex).getBlob((err, blob) => resolve(blob)))
    console.log(blob)
    downloadBlob({blob, fileName})
  }

  const parsedTorrent = {
    name: getRoot(torrent.files[0].path),
    files,
    infoHash,
    magnet,
    sizeInMbs: bytesToMbs(size),
    fileIsStreamable,
    hasStreamableFiles,
    stop,
    restart,
    isRestarting: () => isRestarting,
    addToElement,
    getStatus,
    downloadFile,
    _getTorrent: torrentGetter,
    _client: client
  }

  return parsedTorrent
}

const getDownloadSpeed = (torrent) => {
  try {
    return torrent.client.downloadSpeed
  }
  catch (e) {
    return 0
  }
}

const getUploadSpeed = (torrent) => {
  try {
    return torrent.client.uploadSpeed
  }
  catch (e) {
    return 0
  }
}

const addAsync = (input) => new Promise(resolve => client.add(input, {path: input}, resolve))

const addTorrentMediaToElement = (torrent, cssSelector, mediaIndex) => {
  // input can be an info hash, torrent file buffer (blob in browser) or magnet uri
  debug('appendTorrentMediaToElement', {torrent, cssSelector, mediaIndex})

  return new Promise(resolve => {
    const mediaIndexes = getMediaIndexesFromTorrentFiles(torrent.files)
    if (mediaIndexes.length === 0) {
      return
    }
    const torrentFile = torrent.files[mediaIndex]

    torrentFile.renderTo(cssSelector, {autoplay: false}, (err, element) => {
      resolve(element)
    })
  })
}

const getMagnetFromTorrentFile = (torrentId) => new Promise((resolve, reject) => {
  parseTorrent.remote(torrentId, (err, parsedTorrent) => {
    if (err) return reject(err)
    debug('parsedTorrent', parsedTorrent)

    let magnet = parseTorrent.toMagnetURI(parsedTorrent)
    magnet = prepareMagnetForEthereum(magnet)

    resolve(magnet)
  })
})

const prepareMagnetForEthereum = (magnet) => {
  const torrent = parseTorrent(magnet)

  let preparedMagnet = `magnet:?xt=urn:btih:${torrent.infoHash}`

  let maxTrackers = 3 // we need a low number here or the magnet link will be too big and it will cost too much gas
  for (const tracker of torrent.announce) {
    if (isWebSocket(tracker)) {
      preparedMagnet += `&tr=${tracker}`
      maxTrackers--
    }
    if (!maxTrackers) {
      break
    }
  }

  return preparedMagnet
}

const magnetToInfoHash = (magnet) => {
  const torrent = parseTorrent(magnet)
  return torrent.infoHash
}

export {getTorrent, getMagnetFromTorrentFile, prepareMagnetForEthereum, init, mockWebTorrent, magnetToInfoHash}
