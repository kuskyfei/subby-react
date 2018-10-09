import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {settings} from '../src/settings'

Enzyme.configure({ adapter: new Adapter() })

// inject global variables for unit tests

window.SUBBY_GLOBAL_SETTINGS = settings
window.SUBBY_GLOBAL_SETTINGS.MOCK_ETHEREUM = true
window.SUBBY_GLOBAL_SETTINGS.MOCK_ETHEREUM_NETWORK_DELAY = null

window.TextEncoder = () => ({encode: Buffer.from})

window.TextDecoder = () => ({
  decode: (buffer) => {
    return buffer.toString()
  }
})

window.indexedDB = require('fake-indexeddb')
window.IDBIndex = require('fake-indexeddb/lib/FDBIndex')
window.IDBCursor = require('fake-indexeddb/lib/FDBCursor')
window.IDBCursorWithValue = require('fake-indexeddb/lib/FDBCursorWithValue')
window.IDBDatabase = require('fake-indexeddb/lib/FDBDatabase')
window.IDBFactory = require('fake-indexeddb/lib/FDBFactory')
window.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')
window.IDBObjectStore = require('fake-indexeddb/lib/FDBObjectStore')
window.IDBOpenDBRequest = require('fake-indexeddb/lib/FDBOpenDBRequest')
window.IDBRequest = require('fake-indexeddb/lib/FDBRequest')
window.IDBTransaction = require('fake-indexeddb/lib/FDBTransaction')
window.IDBVersionChangeEvent = require('fake-indexeddb/lib/FDBVersionChangeEvent')

// useful for debugging
const util = require('util')
console.logFull = (...args) => {
  for (const arg of args) {
    console.log(util.inspect(arg, {showHidden: false, depth: null, maxArrayLength: null}))
  }
}
