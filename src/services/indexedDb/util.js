const isObjectStoreName = (string) => {
  return !!string.match(/\d+/)
}

module.exports = {isObjectStoreName}
