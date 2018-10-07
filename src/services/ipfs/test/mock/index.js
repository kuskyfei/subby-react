const fs = require('fs')
const events = require('events')

const getReadableStreamMock = (source) => {
  // create stream
  const stream = new events.EventEmitter()

  // create the data to be passed on "data" event
  const createReadStream = () => fs.createReadStream(source)
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

export {get, add, files}
