const getRoot = (path) => {
  return path.match(/^[^/]+/)[0]
}

const bytesToMbs = (number) => {
  const mb = 1048576
  return (number / mb).toFixed(2)
}

const isWebSocket = (tracker) => {
  return !!tracker.match(/^wss?:\/\//)
}

const getMediaIndexesFromTorrentFiles = (files) => {
  const videosIndexes = []
  let index = 0
  for (const file of files) {
    if (isStreamableVideo(file.path)) {
      videosIndexes.push(index)
    }
    index++
  }

  return videosIndexes
}

const isStreamableVideo = (fileName) => {
  return !!fileName.match(/\.webm$|\.mp4$/)
}

const concatTypedArrays = (a, b) => {
  var c = new (a.constructor)(a.length + b.length)
  c.set(a, 0)
  c.set(b, a.length)
  return c
}

const downloadBlob = ({blob, fileName}) => {
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.style = 'display: none'
  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(url)
}

/* some magnets to test
magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F
magnet:?xt=urn:btih:02767050e0be2fd4db9a2ad6c12416ac806ed6ed&dn=tears_of_steel_1080p.webm&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io
magnet:?xt=urn:btih:a56d309c2a248e96c2bfc2596300c1f3cbb4f034&dn=cat-sleeping.webm&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com
magnet:?xt=urn:btih:4cc28dd535a485d228007f2b3dfccd3a6e92331b&dn=ping+pongs&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com
magnet:?xt=urn:btih:20ee80ca6540dc6fbd99cdb87d235b8b786e0131&dn=You_are_fluent_in_this_language_(and_don't_even_kn%5BV005550364%5D.mp4&tr=dht%3A%2F%2F20EE80CA6540DC6FBD99CDB87D235B8B786E0131.dht%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fdownload.ted.com%2Ftalks%2FChristophNiemann_2018-480p.mp4%3Fapikey%3D172BB350-0206
*/

export {getRoot, bytesToMbs, isWebSocket, getMediaIndexesFromTorrentFiles, concatTypedArrays, downloadBlob, isStreamableVideo}
