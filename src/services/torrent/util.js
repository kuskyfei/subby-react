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

export {getRoot, bytesToMbs, isWebSocket, getMediaIndexesFromTorrentFiles, concatTypedArrays}
