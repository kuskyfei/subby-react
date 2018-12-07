const {version} = require('../../package.json')
const settings = require('./settings')
const blacklist = require('./blacklist')

const prettyPrint = (string, startIndent = 0) => {
  string = JSON.stringify(string, null, 2)
  let startIndentString = ''
  while (startIndent--) {
    startIndentString += ' '
  }
  string = string.replace(/\r?\n/g, '\r\n' + startIndentString)
  return string
}

const settingsMessage = `<script>

  /* Welcome to Subby v${version}. Change your global settings below. */

  window.SUBBY_GLOBAL_SETTINGS = {

    // Specify a username and optional post ID as the 
    // homepage. Leave blank for default. 
    HOMEPAGE_PROFILE: '${settings.HOMEPAGE_PROFILE}',
    HOMEPAGE_POST_ID: '${settings.HOMEPAGE_POST_ID}',

    // To use web3, you must connect to an Ethereum node. 
    // Leave blank to use ethers.js default provider. If 
    // you have MetaMask enabled, the MetaMask provider 
    // will be used.
    WEB3_PROVIDER: '${settings.WEB3_PROVIDER}',

    // To use IPFS, you must connect to an IPFS node. Leave 
    // blank to use Infura default.
    IPFS_PROVIDER: '${settings.IPFS_PROVIDER}',

    // Most features use your chosen IPFS provider, but video
    // and audio streaming use an IPFS gateway.
    IPFS_GATEWAY: '${settings.IPFS_GATEWAY}',
   
    // Links are embeded from sites using iframes 
    // or Javascript.
    REDDIT_EMBEDS: ${settings.REDDIT_EMBEDS},
    FACEBOOK_EMBEDS: ${settings.FACEBOOK_EMBEDS},
    YOUTUBE_EMBEDS: ${settings.YOUTUBE_EMBEDS},
    VIMEO_EMBEDS: ${settings.VIMEO_EMBEDS},
    TWITTER_EMBEDS: ${settings.TWITTER_EMBEDS},
    INSTAGRAM_EMBEDS: ${settings.INSTAGRAM_EMBEDS},

    // Supported IPFS media are embeded into posts.
    IPFS_EMBEDS: ${settings.IPFS_EMBEDS},

    // Web torrent connects to other web torrent enabled 
    // clients and embeds metadata.
    WEB_TORRENT_EMBEDS: ${settings.WEB_TORRENT_EMBEDS},

    // Google Analytics is 100% anonymous, no personally 
    // identifiable information. Data is used to improve 
    // Subby user experience.
    GOOGLE_ANALYTICS: ${settings.GOOGLE_ANALYTICS},

    // Get notified when updates and security fixes are released. 
    // This is done through Subby and does not require a connection 
    // to a centralized server.
    UPDATE_NOTIFICATIONS: ${settings.UPDATE_NOTIFICATIONS},

    // Subby keeps some information in the cache to
    // make it load faster. 1000 = 1 second. Too
    // big of a number will prevent Subby from fetching
    // the most recent information from Ethereum.
    PROFILE_CACHE_TIME: ${settings.PROFILE_CACHE_TIME},
    FEED_CACHE_TIME: ${settings.FEED_CACHE_TIME},
    FEED_CACHE_BUFFER_SIZE: ${settings.FEED_CACHE_BUFFER_SIZE},

    // When false and in http(s):// protocol, viewing posts
    // is disabled and a download button is displayed instead.
    HTTP_POSTS: ${settings.HTTP_POSTS},
    // When true and in http(s):// protocol, blacklisted users' posts
    // are disabled and display a download button instead. In
    // file:// protocol, nothing is ever censored.
    BLACKLIST: ${settings.BLACKLIST}

  }

  window.SUBBY_BLACKLIST = ${prettyPrint(blacklist, 2)}

</script>`

module.exports = settingsMessage
