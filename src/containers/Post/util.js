const isIpfsContent = (string = '') => {
  return typeof string === 'string' && string.match(/^ipfs:/)
}

const isTorrent = (string = '') => {
  return !!string.match(/^magnet:/)
}

const getHash = (string) => {
  const [protocol, hash] = string.split(':') // eslint-disable-line
  return hash
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

module.exports = {isIpfsContent, isTorrent, getHash, downloadBlob}
