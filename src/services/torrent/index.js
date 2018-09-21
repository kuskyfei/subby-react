const WebTorrent = require('webtorrent')
const client = new WebTorrent()
const debug = require('debug')('services:torrent')

const getTorrent = (magnetURI) => {
  debug('getTorrent', magnetURI)

  return new Promise((resolve) => {
    client.add(magnetURI, (torrent) => {
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
    })
  })
}

const getRoot = (path) => {
  return path.match(/^[^/]+/)[0]
}

const bytesToMbs = (number) => {
  const mb = 1048576
  return (number / mb).toFixed(2)
}

export {getTorrent}
