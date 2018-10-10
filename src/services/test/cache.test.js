/* eslint-env jest */

const services = require('../../services')
const {updateFeedCache} = require('../../services/cache/cache')
const minute = 1000 * 60

const profileCacheTime = window.SUBBY_GLOBAL_SETTINGS.PROFILE_CACHE_TIME
const ethereumSubscriptionsCacheTime = window.SUBBY_GLOBAL_SETTINGS.ETHEREUM_SUBSCRIPTIONS_CACHE_TIME
const feedCacheTime = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_TIME
const feedCacheBufferSize = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_BUFFER_SIZE

const {testPost, testPostId} = require('./util')

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
      expect(db1EthereumSubscriptions.length).toEqual(325)
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
    beforeAll(() => {
      jest.setTimeout(60000)
    })
    afterAll(() => {
      jest.setTimeout(5000)
    })

    describe('active feed cache', () => {
      test('background cache expired or null', async () => {
        // first request with empty active cache
        const firstRequestTime = 1000000000
        const publishers = ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222', 'john', 'john2', 'john3', 'john4', 'john5', 'john6', 'john7', 'john8', 'john9', 'john10', 'john11', 'john12', 'john13', 'john14', 'john15', 'john16', 'john17', 'john18']
        let startAt = 0
        const limit = 20
        mockTime(firstRequestTime)

        let res1
        // getFeed has a callback that triggers when the active feed cache is fully updated,
        // there's no reason to use it usually but here we need to tell jest
        // to wait until it's fully resolved otherwise the test ends early
        await new Promise(async resolve => {
          res1 = await services.getFeed({subscriptions: publishers, startAt, limit}, resolve)
        })

        expect(res1.length).toEqual(limit)
        expect(res1[0].timestamp >= res1[1].timestamp && res1[0].timestamp >= res1[19].timestamp).toEqual(true)
        for (const post of res1) {
          testPost(post)
        }

        const db1 = await getDb()
        const {hasMorePosts: db1HasMorePosts, lastActiveFeedCacheTimestamp: db1LastFeedCacheTimestamp, posts: db1Posts} = db1.activeFeed
        const {postIds: db1PostIds, nextPublishers: db1NextPublishers, nextStartAts: db1NextStartAts} = db1.activeFeed.nextCache

        for (const post of db1Posts) {
          testPost(post)
        }
        for (const postId of db1PostIds) {
          testPostId(postId)
        }
        expect(db1Posts.length).toEqual(feedCacheBufferSize)
        expect(publishers).toEqual(db1NextPublishers)
        expect(db1Posts[0].timestamp >= db1Posts[1].timestamp && db1Posts[0].timestamp >= db1Posts[feedCacheBufferSize-1].timestamp).toEqual(true)
        expect(db1HasMorePosts).toEqual(true)
        expect(db1LastFeedCacheTimestamp).toEqual(firstRequestTime)

        // second request with page 2 with expired cache
        startAt += limit
        mockTime(firstRequestTime + feedCacheTime + minute)

        // since the cache doesn't update, there's no need for a callback
        const res2 = await services.getFeed({subscriptions: publishers, startAt, limit})
        const db2 = await getDb()

        // the db should be the same since even if the cache
        // is expired, we want to keep going on the same active
        // cache for page 2
        expect(db2).toEqual(db1)
        // res should be page 2
        expect(res2).not.toEqual(res1)
        expect(res2.length).toEqual(limit)
        expect(res2[0].timestamp >= res2[1].timestamp && res2[0].timestamp >= res2[19].timestamp).toEqual(true)
        for (const post of res2) {
          testPost(post)
        }

        // third request fetches posts above the buffer size
        startAt = feedCacheBufferSize
        const res3 = await services.getFeed({subscriptions: publishers, startAt, limit})

        // res should be different
        expect(res3).not.toEqual(res1)
        expect(res3).not.toEqual(res2)
        expect(res3.length).toEqual(limit)
        expect(res3[0].timestamp >= res3[1].timestamp && res3[0].timestamp >= res3[19].timestamp).toEqual(true)
        for (const post of res3) {
          testPost(post)
        }

        expect(db3).not.toEqual(db1)
        expect(db3).not.toEqual(db2)

        const db3 = await getDb()
        const {hasMorePosts: db3HasMorePosts, lastActiveFeedCacheTimestamp: db3LastFeedCacheTimestamp, posts: db3Posts} = db3.activeFeed
        const {postIds: db3PostIds, nextPublishers: db3NextPublishers, nextStartAts: db3NextStartAts} = db3.activeFeed.nextCache

        for (const post of db3Posts) {
          testPost(post)
        }
        for (const postId of db3PostIds) {
          testPostId(postId)
        }
        expect(db3Posts.length).toEqual(feedCacheBufferSize + limit)
        expect(publishers).toEqual(db3NextPublishers)
        expect(db3Posts[0].timestamp >= db3Posts[1].timestamp && db3Posts[0].timestamp >= db3Posts[feedCacheBufferSize-1].timestamp).toEqual(true)
        expect(db3HasMorePosts).toEqual(true)
        // the timestamp should have changed since the cache was changed
        expect(db3LastFeedCacheTimestamp).toEqual(firstRequestTime + feedCacheTime + minute)

        // fourth request starts at page 1 again,
        // which should completely reset the cache
        // even though it's not expired
        startAt = 0
        mockTime(firstRequestTime + feedCacheTime + minute)

        let res4
        await new Promise(async resolve => {
          res4 = await services.getFeed({subscriptions: publishers, startAt, limit}, resolve)
        })
        const db4 = await getDb()

        expect(res4).toEqual(res1)

        expect(db4).not.toEqual(db1)

        const {hasMorePosts: db4HasMorePosts, lastActiveFeedCacheTimestamp: db4LastFeedCacheTimestamp, posts: db4Posts} = db4.activeFeed
        const {postIds: db4PostIds, nextPublishers: db4NextPublishers, nextStartAts: db4NextStartAts} = db4.activeFeed.nextCache

        for (const post of db4Posts) {
          testPost(post)
        }
        for (const postId of db4PostIds) {
          testPostId(postId)
        }
        expect(db4Posts.length).toEqual(feedCacheBufferSize)
        expect(publishers).toEqual(db1NextPublishers)
        expect(db4Posts[0].timestamp >= db4Posts[1].timestamp && db4Posts[0].timestamp >= db4Posts[feedCacheBufferSize-1].timestamp).toEqual(true)
        expect(db4HasMorePosts).toEqual(true)
        expect(db4LastFeedCacheTimestamp).toEqual(firstRequestTime + feedCacheTime + minute)
      })

      test('has no more posts active cache', async () => {

      })

      test('does not have nextCache', async () => {

      })

    })

    describe('background feed cache', () => {

      test('has no more posts active cache', async () => {

      })

    test('buffer exceeded', async () => {
 

    })

    test('page 2 with no cache', async () => {

    })

    test('page 2 with expired cache', async () => {

    })
  })
})
