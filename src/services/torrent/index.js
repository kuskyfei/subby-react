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
  let temporaryWires, isPaused

  const pause = () => {
    isPaused = true
    temporaryWires = torrent.wires
    torrent.wires = []
  }

  const unpause = (fileIndex = 0) => {
    isPaused = false
    if (!temporaryWires) {
      return
    }
    if (torrent.wires.length > 0) {
      return
    }
    torrent.wires = temporaryWires
    temporaryWires = null

    // creating a stream gives priority to this file
    // when unpausing
    torrent.files[fileIndex].createReadStream()
  }

  torrent = client.get(input, {path: input})

  if (!torrent) {
    torrent = await addAsync(input)
  }
  if (torrent.destroyed) {
    torrent = client.add(input, {path: input})
  }

  // we need to pause right after starting otherwise 
  // it starts downloading and wasting bandwidth
  pause()

  const {infoHash, magnetURI: magnet, length: size} = torrent

  const files = []
  const fileNames = []
  let hasStreamableFiles = false
  for (const file of torrent.files) {
    files.push(file.path)
    fileNames.push(file.name)
    if (isStreamableVideo(file.path)) {
      hasStreamableFiles = true
    }
  }

  const fileIsStreamable = (fileIndex) => {
    return isStreamableVideo(files[fileIndex])
  }

  const mediaIndexes = getMediaIndexesFromTorrentFiles(torrent.files)

  const stop = () => torrent.destroy()

  let isRestarting
  const restart = () => new Promise(resolve => {
    debug('restart')
    isRestarting = true
    torrent = client.add(input, {path: input})
    torrent.on('ready', () => {
      isRestarting = false
      resolve()
    })
  })

  const getStatus = () => ({
    progress: torrent.progress,
    filesProgress: getFilesProgress(torrent),
    filesDone: getFilesDone(torrent),
    timeRemaining: torrent.timeRemaining,
    peerCount: torrent._peersLength,
    downloadSpeed: getDownloadSpeed(torrent),
    uploadSpeed: getUploadSpeed(torrent),
    done: torrent.done,
    stopped: torrent.destroyed,
    paused: isPaused
  })

  const addToElement = (cssSelector, fileIndex) => addTorrentMediaToElement(torrent, cssSelector, fileIndex)

  const downloadFile = async (fileIndex) => {
    const fileName = torrent.files[fileIndex].name
    const blob = await new Promise(resolve => torrent.files[fileIndex].getBlob((err, blob) => resolve(blob)))
    downloadBlob({blob, fileName})
  }

  const parsedTorrent = {
    name: getRoot(torrent.files[0].path),
    files,
    fileNames,
    infoHash,
    magnet,
    mediaIndexes,
    sizeInMbs: bytesToMbs(size),
    fileIsStreamable,
    hasStreamableFiles,
    pause,
    unpause,
    stop,
    restart,
    isRestarting: () => isRestarting,
    addToElement,
    getStatus,
    downloadFile,
    _getTorrent: () => torrent,
    _client: client
  }

  return parsedTorrent
}

const getFilesProgress = (torrent) => {
  const filesProgress = []

  if (!torrent || !torrent.files) {
    return filesProgress
  }

  for (const file of torrent.files) {
    filesProgress.push(file.progress)
  }
  return filesProgress
}

const getFilesDone = (torrent) => {
  const filesDone = []

  if (!torrent || !torrent.files) {
    return filesDone
  }

  for (const file of torrent.files) {
    const isDone = file.progress === 1
    filesDone.push(isDone)
  }
  return filesDone
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
