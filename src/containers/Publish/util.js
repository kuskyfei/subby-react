const fileToTypedArray = (file) => {
  return new Promise(resolve => {
    let arrayBuffer
    const fileReader = new window.FileReader()
    fileReader.onload = ({target}) => {
      arrayBuffer = target.result
      const typedArray = arrayBufferToTypedArray(arrayBuffer)
      resolve(typedArray)
    }
    fileReader.readAsArrayBuffer(file)
  })
}

const arrayBufferToTypedArray = (buffer) => {
  var bytes = new Uint8Array(buffer)
  return bytes
}

const clearDataTransfer = (dataTransfer) => {
  if (dataTransfer.items) {
    dataTransfer.items.clear()
  } else {
    dataTransfer.clearData()
  }
}

const isMagnet = (link) => {
  if (link.match(/^magnet:/)) {
    return true
  }
}

const isIpfsHash = (link) => {
  if (!link.match(/^Qm/)) { // current IPFS implementations start with Qm, could change in the future
    return false
  }

  if (link.length !== 46) { // current IPFS implementations are 46 chars, could change in the future
    return false
  }

  if (!link.match(/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/)) { // base58 encoding
    return false
  }

  return true
}

module.exports = {fileToTypedArray, clearDataTransfer, isIpfsHash, isMagnet}
