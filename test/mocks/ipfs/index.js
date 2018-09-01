const fs = require('fs')
const events = require('events')

const getReadableStreamMock = (source) => {
  // create stream
  const stream = new events.EventEmitter()

  // create the data to be passed on "data" event
  createReadStream = () => fs.createReadStream(source)
  const file = {
    content: createReadStream
  }
  
  // emit data event
  stream.emit('data', file)

  return stream
}


const get = () => [{content: Buffer.from('test')}]
const add = () => 'test hash'
const files = {
  getReadableStream: getReadableStreamMock
}

export default {get, add, files}
