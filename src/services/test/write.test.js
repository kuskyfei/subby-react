/* eslint-env jest */

/*
const services = require('../../services')
const minute = 1000 * 60

const profileCacheTime = window.SUBBY_GLOBAL_SETTINGS.PROFILE_CACHE_TIME
const ethereumSubscriptionsCacheTime = window.SUBBY_GLOBAL_SETTINGS.ETHEREUM_SUBSCRIPTIONS_CACHE_TIME
const feedCacheTime = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_TIME
const feedCachedPreemptivelyCount = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHED_PREEMPTIVELY_COUNT
const minimumUnreadFeedCachedCount = window.SUBBY_GLOBAL_SETTINGS.MINIMUM_UNREAD_FEED_CACHED_COUNT

const resetDb = async () => {
  await timeout(100)
  await window.SUBBY_DEBUG_DELETE_INDEXEDDB()
}

const getDb = async () => {
  const db = await window.SUBBY_DEBUG_INDEXEDDB()
  return db
}

const mockTime = (timestamp) => {
  Date.now = () => timestamp
}

const restoreMocks = {}

const ADDRESSES = ['0x79d5c59a00d65ea9ac571ad67db5a8f3afabacea']

describe('services', () => {
  beforeEach(async () => {
    services.mockWebTorrent()
    await services.init()
    services.mockSmartContracts()
    services.mockIpfsApi()

    restoreMocks.DateNow = Date.now
  })
  afterEach(async () => {
    await resetDb()

    Date.now = restoreMocks.DateNow
  })

  describe('get profile', () => {
    test('cache expires', async () => {

    })
  })
})
*/
