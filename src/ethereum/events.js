const {init} = require('./init')
const state = require('./state')
const queue = require('queue')
const q = queue({concurrency: 1, autostart: true, timeout: 1000})

const events = {
  on: async (options, cb) => {
    await init()

    const events = state.web3.eth.filter(options)

    events.watch((err, event) => q.push(() => new Promise(async (resolve) => { // eslint-disable-line
      await cb(event)
      resolve()
    })))
  }
}

export {events}
