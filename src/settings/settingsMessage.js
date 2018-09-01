const {version} = require('../../package.json')
const {ipfsProvider, web3Provider} = require('./providers')

const settingsMessage = `<script>
  
  /* Welcome to Subby v${version}. Change your global settings below. */

  window.SUBBY_GLOBAL_SETTINGS = {

    // To use web3, you must connect to an Ethereum node.
    // Subby uses Infura by default. You can add your own
    // here. Note that if you have Metamask enabled, the
    // MetaMask default provider will be used.
    WEB3_PROVIDER: '${web3Provider}',

    // To use IPFS, you must connect to an IPFS node.
    // Subby uses infura by default. You can add your
    // own here.
    IPFS_PROVIDER: '${ipfsProvider}',
   
    // Embed content makes Subby fun to use, but it also
    // allows companies to track you. Turn them off here.
    REDDIT_EMBEDS: true,
    FACEBOOK_EMBEDS: true,
    YOUTUBE_EMBEDS: true,
    VIMEO_EMBEDS: true,
    TWITTER_EMBEDS: true,
    INSTAGRAM_EMBEDS: true,

    // IPFS is great, but nodes/providers might be able to
    // track you. Turn it off here.
    IPFS_EMBEDS: true,

    // Web torrent allows you to connect to other web
    // torrent enabled clients, Those might be able to
    // track you. Turn it off here.
    WEB_TORRENT_EMBEDS: true,

    // Google analytics is 100% anonymous, the data is 
    // used to improve Subby user experience.
    GOOGLE_ANALYTICS: true,

    // Get notified when updates and security fixes
    // are released. This is done through Subby and
    // does not require a connection to a centralized
    // server.
    UPDATE_NOTIFICATIONS: true,
  }

</script>`

module.exports = settingsMessage
