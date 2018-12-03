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

export {getRoot, bytesToMbs, isWebSocket, getMediaIndexesFromTorrentFiles, concatTypedArrays, downloadBlob, isStreamableVideo}
