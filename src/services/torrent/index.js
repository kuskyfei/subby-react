const parseTorrent = require('parse-torrent')
const debug = require('debug')('services:torrent')

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

      const parsedTorrent = {
        name: getRoot(torrent.files[0].path),
        files,
        peerCount: numPeers,
        infoHash,
        magnet: magnetURI,
        sizeInMbs: bytesToMbs(length)
      }

      resolve(parsedTorrent)
      torrent.destroy()
    }
  })
}

const getRoot = (path) => {
  return path.match(/^[^/]+/)[0]
}

const bytesToMbs = (number) => {
  const mb = 1048576
  return (number / mb).toFixed(2)
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
    }
    if (!--maxTrackers) {
      break
    }
  }

  return preparedMagnet
}

const isWebSocket = (tracker) => {
  return !!tracker.match(/^wss?:\/\//)
}

export {getTorrent, getMagnetFromTorrentFile, prepareMagnetForEthereum, init, mockWebTorrent}
