const minute = 1000 * 60

// these are the default recommended settings that get
// transpiled into the subby.html file.
const settings = {
  HOMEPAGE_PROFILE: '',
  HOMEPAGE_POST_ID: '',

  WEB3_PROVIDER: '',
  IPFS_PROVIDER: 'https://ipfs.infura.io:5001',

  REDDIT_EMBEDS: true,
  FACEBOOK_EMBEDS: true,
  YOUTUBE_EMBEDS: true,
  VIMEO_EMBEDS: true,
  TWITTER_EMBEDS: true,
  INSTAGRAM_EMBEDS: true,

  IPFS_EMBEDS: true,
  WEB_TORRENT_EMBEDS: true,

  GOOGLE_ANALYTICS: true,

  UPDATE_NOTIFICATIONS: true,

  PROFILE_CACHE_TIME: 0.5 * minute,
  FEED_CACHE_TIME: 5 * minute,
  FEED_CACHE_BUFFER_SIZE: 500,
  HTTP_POSTS: true,

  // IndexedDb is Chrome's local database that Subby
  // uses to cache posts as well as store your subscriptions.
  INDEXEDDB_VERSION: 1,
  ETHEREUM_NETWORK: 'main',
}

module.exports = settings
