/* eslint brace-style: 0 */

const isIpfsContent = (string = '') => {
  return typeof string === 'string' && string.match(/^ipfs:/)
}

const isTorrent = (string = '') => {
  return !!string.match(/^magnet:/)
}

const ipfsParamsToObject = (string) => {
  string = string.replace(/^ipfs:\?/, '')
  const splitParams = string.split('&')

  const params = {}
  for (const param of splitParams) {
    const match = /([^=])=(.+)/.exec(param)
    const key = match[1]
    const value = match[2]
    params[key] = value
  }

  return params
}

const linkToIpfsParams = (string) => {
  // the first format for IPFS hashes is
  // ipfs:?h=hash&c=codec
  if (string.match(/^ipfs:\?/)) {
    const params = ipfsParamsToObject(string)
    return {
      hash: params.h,
      codecs: params.c
    }
  }
  // the second format for IPFS hashes is
  // ipfs:hash
  else {
    const [protocol, hash] = string.split(':') // eslint-disable-line
    return {hash}
  }
}

const ipfsParamsToLink = (ipfsParams) => {
  return `ipfs:?h=${ipfsParams.hash}&c=${ipfsParams.codecs}`
}

const getMediaSourceType = (fileMimeType) => {
  const isAudio = fileMimeType.match(/audio/)
  const isVideo = fileMimeType.match(/video/)

  if (isAudio) {
    return 'audio'
  }
  if (isVideo) {
    return 'video'
  }
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

module.exports = {isIpfsContent, isTorrent, linkToIpfsParams, ipfsParamsToLink, downloadBlob, getMediaSourceType}
