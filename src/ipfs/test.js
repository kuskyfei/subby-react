const ipfs = require('./index')
ipfs.setProvider('https://ipfs.infura.io:5001')
const fileType = require('file-type')

// var Magic = require('mmmagic').Magic;
// var magic = new Magic()

// const stream = ipfs.getReadableStream()('QmeeogFMkaWi3n1hurdMXLuAHjG2tSaYfFXvXqP6SPd1zo') // image
const stream = ipfs.getReadableStream()('QmdbaL9CpPoJXHTSx9BxxkHAv9k1wcyzbdRLdKHPsPVfYs') // video

stream.on('data', (file) => {
  if (file.type !== 'dir') {
    file.content.on('data', (data) => {
      // magic.detect(data, function(err, result) {
      //   if (err) throw err
      //   console.log(result)
      // })
      console.log(fileType(data))
    })
    // file.content.resume()
  }
})
