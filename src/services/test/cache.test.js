/* eslint-env jest */

const services = require('../../services')
const minute = 1000*60

const profileCacheTime = window.SUBBY_GLOBAL_SETTINGS.PROFILE_CACHE_TIME
const lastLoggedSubscriptionsCacheTime = window.SUBBY_GLOBAL_SETTINGS.LOGGED_IN_SUBSCRIPTIONS_CACHE_TIME
const feedCacheTime = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_TIME
// const feedCachedPreemptivelyCount = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHED_PREEMPTIVELY_COUNT
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
    test('cache', async () => {
      const firstRequestTime = 1000000000
      const profile = { address: '0x79d5c59a00d65ea9ac571ad67db5a8f3afabacea',
        username: 'Antwan.Stamm',
        minimumTextDonation: 0.05,
        bio:
         'Provident ducimus iure ducimus similique aut neque sunt non. Sed mollitia vel voluptates fugiat nostrum nihil expedita labore quo. Fugiat minima nisi deserunt voluptatem ullam quia. antwan.org',
        thumbnail: 'https://i.imgur.com/I5BH2CW.jpg',
        subscriberCount: 0 }

      // first request with empty cache
      mockTime(firstRequestTime)

      const res1 = await services.getProfile('0x79d5c59a00d65ea9ac571ad67db5a8f3afabacea')
      const db1 = await getDb()

      expect(res1).toEqual(profile)
      // adding lastProfileCacheTimestamp which is in the db request
      profile.lastProfileCacheTimestamp = firstRequestTime
      expect(profile).toEqual(db1.profiles[res1.address])
      expect(profile).toEqual(db1.profiles[res1.username])

      // second request with non-expired cache 1 minute later
      mockTime(firstRequestTime + minute)

      const res2 = await services.getProfile('0x79d5c59a00d65ea9ac571ad67db5a8f3afabacea')
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

      const res3 = await services.getProfile('0x79d5c59a00d65ea9ac571ad67db5a8f3afabacea')
      const db3 = await getDb()

      // cache has been replaced so lastProfileCacheTimestamp should be different
      expect(db3.profiles[res1.address].lastProfileCacheTimestamp).toEqual(newTime)
      expect(db3.profiles[res1.username].lastProfileCacheTimestamp).toEqual(newTime)
      // everything else should be the same
      expect(res3).toEqual(res1)
    })
  })

  describe('get subscriptions', () => {
    test('cache', async () => {
      const firstRequestTime = 1000000000
      const profile = {}

      // first request with empty cache
      mockTime(firstRequestTime)

      const res1 = await services.getSubscriptions('0x79d5c59a00d65ea9ac571ad67db5a8f3afabacea')
      const db1 = await getDb()

      console.log(res1)
      console.logFull(db1)

      const db1LoggedInSubscriptions = Object.keys(db1.loggedInSubscriptions['0x79d5c59a00d65ea9ac571ad67db5a8f3afabacea'].subscriptions)
      const db1LastLoggedInSubscriptionsCacheTimestamp = db1.loggedInSubscriptions['0x79d5c59a00d65ea9ac571ad67db5a8f3afabacea'].lastLoggedInSubscriptionsCacheTimestamp
      
      console.log(db1LoggedInSubscriptions.length)
      console.log(db1LastLoggedInSubscriptionsCacheTimestamp)

/*
      expect(res1).toEqual(profile)
      expect(res1).toEqual(db1.profiles[res1.address])
      expect(res1).toEqual(db1.profiles[res1.username])

      // second request with non-expired cache 1 minute later
      mockTime(firstRequestTime + minute)

      const res2 = await services.getProfile('0x79d5c59a00d65ea9ac571ad67db5a8f3afabacea')
      const db2 = await getDb()

      const db1LastProfileCacheTimestamp = db1.profiles[res1.username].lastProfileCacheTimestamp
      const db2LastProfileCacheTimestamp = db2.profiles[res1.username].lastProfileCacheTimestamp

      // everything should be exactly the same since it used the previous cache
      expect(res1).toEqual(res2)
      expect(db1).toEqual(db2)
      expect(res1.lastProfileCacheTimestamp).toEqual(res2.lastProfileCacheTimestamp)
      expect(db1LastProfileCacheTimestamp).toEqual(db2LastProfileCacheTimestamp)

      // third request with expired cache
      const newTime = firstRequestTime + profileCacheTime + 1
      mockTime(newTime)

      const res3 = await services.getProfile('0x79d5c59a00d65ea9ac571ad67db5a8f3afabacea')
      const db3 = await getDb()

      // cache has been replaced so lastProfileCacheTimestamp should be different
      expect(res3.lastProfileCacheTimestamp).toEqual(newTime)
      expect(db3.profiles[res1.address].lastProfileCacheTimestamp).toEqual(newTime)
      expect(db3.profiles[res1.username].lastProfileCacheTimestamp).toEqual(newTime)
      
      // everything else should be the same
      res1.lastProfileCacheTimestamp = 1
      res3.lastProfileCacheTimestamp = 1
      expect(res1).toEqual(res3)
      */
    })
  })
})

// const settings = await services.getSettings()

// const address = await services.getAddress()
// const address = '0xBD6d79F3f02584cfcB754437Ac6776c4C6E0a0eC'
// const profile = await services.getProfile(address)

// const subscriptions = await services.getSubscriptions({address})
