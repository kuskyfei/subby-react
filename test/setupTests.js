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

console.log = () => {}
console.error = () => {}
