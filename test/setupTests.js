import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {providers} from '../src/settings'

Enzyme.configure({ adapter: new Adapter() })

// inject global variables for unit tests

window.SUBBY_GLOBAL_SETTINGS = {
  WEB3_PROVIDER: providers.web3Provider,
  IPFS_PROVIDER: providers.ipfsProvider,

  REDDIT_EMBEDS: true,
  FACEBOOK_EMBEDS: true,
  YOUTUBE_EMBEDS: true,
  VIMEO_EMBEDS: true,
  TWITTER_EMBEDS: true,
  INSTAGRAM_EMBEDS: true,

  IPFS_EMBEDS: true,
  WEB_TORRENT_EMBEDS: true,

  GOOGLE_ANALYTICS: true,

  UPDATE_NOTIFICATIONS: true
}

window.TextEncoder = () => ({encode: Buffer.from})

window.TextDecoder = () => ({
  decode: (buffer) => {
    return buffer.toString()
  }
})