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

module.exports = {fileToTypedArray}