const isIpfsContent = (string = '') => {
  return !!string.match(/^ipfs:/)
}

const getHash = (string) => {
	const [protocol, hash] = string.split(':')
	return hash
}

const downloadBlob = ({blob, fileName}) => {
    var a = document.createElement("a")
    document.body.appendChild(a)
    a.style = "display: none"
    url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(url)
}

module.exports = {isIpfsContent, getHash, downloadBlob}
