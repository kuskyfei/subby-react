const write = require('./write')
const read = require('./read')
const {init} = require('./db')

module.exports = {...read, ...write, init}
