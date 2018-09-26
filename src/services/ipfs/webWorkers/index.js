let GetBlobFromStream

try {
  GetBlobFromStream = require('./getBlobFromStream.worker.js')
} catch (e) {
  console.warn(`getBlobFromStream webWorker couldn't run`)
}

module.exports = {GetBlobFromStream}
