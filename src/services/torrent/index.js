const parseTorrent = require('parse-torrent')
const debug = require('debug')('services:torrent')
const {getRoot, bytesToMbs, isWebSocket, getMediaIndexesFromTorrentFiles, concatTypedArrays} = require('./util')

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

const getTorrent = (input) => {
  // input can be an info hash, torrent file buffer (blob in browser) or magnet uri
  debug('getTorrent', input)

  return new Promise((resolve) => {
    try {
      client.add(input, (torrent) => {
        handleTorrent(torrent)
      })
    } catch (e) {
      debug(e)
      client.get(input, (torrent) => {
        handleTorrent(torrent)
      })
    }

    const handleTorrent = (torrent) => {
      debug('torrent', torrent)

      const {numPeers, infoHash, magnetURI, length} = torrent

      const files = []
      for (const file of torrent.files) {
        files.push(file.path)
      }

      const addToElement = (cssSelector, fileIndex) => addTorrentMediaToElement(torrent, cssSelector, fileIndex)
      const mediaIndexes = getMediaIndexesFromTorrentFiles(torrent.files)

      const parsedTorrent = {
        name: getRoot(torrent.files[0].path),
        files,
        peerCount: numPeers,
        infoHash,
        magnet: magnetURI,
        sizeInMbs: bytesToMbs(length),
        addToElement,
        mediaIndexes
      }

      // no need to destroy currently
      // torrent.destroy()
      resolve(parsedTorrent)
    }
  })
}

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
