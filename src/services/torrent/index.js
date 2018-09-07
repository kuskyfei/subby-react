const WebTorrent = require('webtorrent')
const client = new WebTorrent()

const getTorrent = (infoHash) => {
  return new Promise((resolve) => {
    console.log(infoHash)

    client.add(infoHash, (torrent) => {
      console.log(torrent)

      const {numPeers, infoHash, magnetURI} = torrent

      const files = []
      for (const file of torrent.files) {
        files.push(file.path)
      }

      const parsedTorrent = {
        name: getRoot(torrent.files[0].path),
        files,
        numPeers,
        infoHash,
        magnetURI
      }

      resolve(parsedTorrent)
    })
  })
}

const getRoot = (path) => {
  return path.match(/^[^/]+/)[0]
}

export {getTorrent}
