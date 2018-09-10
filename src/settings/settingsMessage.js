const {version} = require('../../package.json')
const settings = require('./settings')

const settingsMessage = `<script>
  
  /* Welcome to Subby v${version}. Change your global settings below. */

  window.SUBBY_GLOBAL_SETTINGS = {

    // To use web3, you must connect to an Ethereum node.
    // Subby uses Infura by default. You can add your own
    // here. Note that if you have Metamask enabled, the
    // MetaMask default provider will be used.
    WEB3_PROVIDER: '${settings.WEB3_PROVIDER}',

    // To use IPFS, you must connect to an IPFS node.
    // Subby uses infura by default. You can add your
    // own here.
    IPFS_PROVIDER: '${settings.IPFS_PROVIDER}',
   
    // Embed content makes Subby fun to use, but it also
    // allows companies to track you. Turn them off here.
    REDDIT_EMBEDS: ${settings.REDDIT_EMBEDS},
    FACEBOOK_EMBEDS: ${settings.FACEBOOK_EMBEDS},
    YOUTUBE_EMBEDS: ${settings.YOUTUBE_EMBEDS},
    VIMEO_EMBEDS: ${settings.VIMEO_EMBEDS},
    TWITTER_EMBEDS: ${settings.TWITTER_EMBEDS},
    INSTAGRAM_EMBEDS: ${settings.INSTAGRAM_EMBEDS},

    // IPFS is great, but nodes/providers might be able to
    // track you. Turn it off here.
    IPFS_EMBEDS: ${settings.IPFS_EMBEDS},

    // Web torrent allows you to connect to other web
    // torrent enabled clients, Those might be able to
    // track you. Turn it off here.
    WEB_TORRENT_EMBEDS: ${settings.WEB_TORRENT_EMBEDS},

    // Google analytics is 100% anonymous, the data is 
    // used to improve Subby user experience.
    GOOGLE_ANALYTICS: ${settings.GOOGLE_ANALYTICS},

    // Get notified when updates and security fixes
    // are released. This is done through Subby and
    // does not require a connection to a centralized
    // server.
    UPDATE_NOTIFICATIONS: ${settings.UPDATE_NOTIFICATIONS},

    // Subby keeps some information in the cache to
    // make it load faster. 1000 = 1 second. Too
    // big of a number will prevent Subby from fetching
    // the most recent information from Ethereum.
    PROFILE_CACHE_TIME: ${settings.PROFILE_CACHE_TIME},
    FEED_CACHE_TIME: ${settings.FEED_CACHE_TIME},
    LOGGED_IN_SUBSCRIPTIONS_CACHE_TIME: ${settings.LOGGED_IN_SUBSCRIPTIONS_CACHE_TIME},
    FEED_CACHED_PREEMPTIVELY_COUNT: ${settings.FEED_CACHED_PREEMPTIVELY_COUNT},
    MINIMUM_UNREAD_FEED_CACHED_COUNT: ${settings.MINIMUM_UNREAD_FEED_CACHED_COUNT},

  }

</script>`

module.exports = settingsMessage
