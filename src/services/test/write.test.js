/* eslint-env jest */

const services = require('../../services')
const minute = 1000*60

const profileCacheTime = window.SUBBY_GLOBAL_SETTINGS.PROFILE_CACHE_TIME
const ethereumSubscriptionsCacheTime = window.SUBBY_GLOBAL_SETTINGS.ETHEREUM_SUBSCRIPTIONS_CACHE_TIME
const feedCacheTime = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_TIME
const feedCachedPreemptivelyCount = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHED_PREEMPTIVELY_COUNT
const minimumUnreadFeedCachedCount = window.SUBBY_GLOBAL_SETTINGS.MINIMUM_UNREAD_FEED_CACHED_COUNT

const resetDb = async () => {
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
      const firstRequestTime = 1000000000
      const profile = { address: ADDRESSES[0],
        username: 'Antwan.Stamm',
        minimumTextDonation: 0.05,
        bio:
         'Provident ducimus iure ducimus similique aut neque sunt non. Sed mollitia vel voluptates fugiat nostrum nihil expedita labore quo. Fugiat minima nisi deserunt voluptatem ullam quia. antwan.org',
        thumbnail: 'https://i.imgur.com/I5BH2CW.jpg',
        subscriberCount: 0 }

      // first request with empty cache
      mockTime(firstRequestTime)

      const res1 = await services.getProfile(ADDRESSES[0])
      const db1 = await getDb()

      expect(res1).toEqual(profile)
      // adding lastProfileCacheTimestamp which is in the db request
      profile.lastProfileCacheTimestamp = firstRequestTime
      expect(profile).toEqual(db1.profiles[res1.address])
      expect(profile).toEqual(db1.profiles[res1.username])

      // second request with non-expired cache 1 minute later
      mockTime(firstRequestTime + minute)

      const res2 = await services.getProfile(ADDRESSES[0])
      const db2 = await getDb()

      const db1LastProfileCacheTimestamp = db1.profiles[res1.username].lastProfileCacheTimestamp
      const db2LastProfileCacheTimestamp = db2.profiles[res1.username].lastProfileCacheTimestamp

      // everything should be exactly the same since it used the previous cache
      expect(res2).toEqual(res1)
      expect(db2).toEqual(db1)
      expect(res2.lastProfileCacheTimestamp).toEqual(res1.lastProfileCacheTimestamp)
      expect(db2LastProfileCacheTimestamp).toEqual(db1LastProfileCacheTimestamp)

      // third request with expired cache
      const newTime = firstRequestTime + profileCacheTime + 1
      mockTime(newTime)

      const res3 = await services.getProfile(ADDRESSES[0])
      const db3 = await getDb()

      // cache has been replaced so lastProfileCacheTimestamp should be different
      expect(db3.profiles[res1.address].lastProfileCacheTimestamp).toEqual(newTime)
      expect(db3.profiles[res1.username].lastProfileCacheTimestamp).toEqual(newTime)
      // everything else should be the same
      expect(res3).toEqual(res1)
    })
  })

  describe('get subscriptions', () => {
    test('cache expires', async () => {
      const firstRequestTime = 1000000000

      // first request with empty cache
      mockTime(firstRequestTime)

      const res1 = await services.getSubscriptions(ADDRESSES[0])
      const db1 = await getDb()

      // there's only ethereumSubscriptions so far so activeSubscriptions should be the same
      expect(res1.ethereumSubscriptions).toEqual(res1.activeSubscriptions)

      const db1EthereumSubscriptions = Object.keys(db1.ethereumSubscriptions[ADDRESSES[0]].subscriptions)
      const db1LastEthereumSubscriptionsCacheTimestamp = db1.ethereumSubscriptions[ADDRESSES[0]].lastEthereumSubscriptionsCacheTimestamp
      expect(db1EthereumSubscriptions.length).toEqual(172)
      expect(db1LastEthereumSubscriptionsCacheTimestamp).toEqual(firstRequestTime)

      // second request with non-expired cache 1 minute later
      mockTime(firstRequestTime + minute)

      const res2 = await services.getSubscriptions(ADDRESSES[0])
      const db2 = await getDb()

      // everything should be exactly the same since it used the previous cache
      expect(res2).toEqual(res1)
      expect(db2).toEqual(db1)

      // third request with expired cache
      const newTime = firstRequestTime + ethereumSubscriptionsCacheTime + 1
      mockTime(newTime)

      const res3 = await services.getSubscriptions(ADDRESSES[0])
      const db3 = await getDb()

      const db3LastEthereumSubscriptionsCacheTimestamp = db3.ethereumSubscriptions[ADDRESSES[0]].lastEthereumSubscriptionsCacheTimestamp

      // everything should be the same execpt the cache timestamp
      expect(res3).toEqual(res1)
      expect(db3LastEthereumSubscriptionsCacheTimestamp).toEqual(newTime)
    })
  })

  describe('get feed', () => {
    test('cache expires', async () => {
      const firstRequestTime = 1000000000

    })
  })
})
