/* eslint-env jest */

const services = require('../../services')
const cache = require('../../services/cache/cache')
const minute = 1000 * 60

const profileCacheTime = window.SUBBY_GLOBAL_SETTINGS.PROFILE_CACHE_TIME
const ethereumSubscriptionsCacheTime = window.SUBBY_GLOBAL_SETTINGS.ETHEREUM_SUBSCRIPTIONS_CACHE_TIME
const feedCacheTime = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_TIME
const feedCacheBufferSize = window.SUBBY_GLOBAL_SETTINGS.FEED_CACHE_BUFFER_SIZE

const {testPost, testPostId, resetDb, getDb, mockTime, getDuplicatePosts} = require('./util')

const restoreMocks = {}

const ADDRESSES = ['0x79d5c59a00d65ea9ac571ad67db5a8f3afabacea', '0x1234567890123456789012345678901234567890']
const PUBLISHERS = ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222', 'john', 'john2', 'john3']

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
      const profile = {"address": "0x79d5c59a00d65ea9ac571ad67db5a8f3afabacea", "bio": "Provident ducimus iure ducimus similique aut neque sunt non. Sed mollitia vel voluptates fugiat nostrum nihil expedita labore quo. Fugiat minima nisi deserunt voluptatem ullam quia. antwan.org", "hideDonations": false, "isTerminated": false, "minimumTextDonation": 0.05, "thumbnail": "https://i.imgur.com/I5BH2CW.jpg", "totalDonationsAmount": 0, "username": "Antwan.Stamm"}

      // first request with empty cache
      mockTime(firstRequestTime)

      const res1 = await services.getProfile(ADDRESSES[0])
      const db1 = await getDb()

      expect(res1).toEqual(profile)
      // adding lastProfileCacheTimestamp which is in the db request
      profile.lastProfileCacheTimestamp = firstRequestTime
      expect(profile).toEqual(db1.profiles[res1.address])
      expect(profile).toEqual(db1.profiles[res1.username])

      // second request with non-expired cache 100 ms later
      mockTime(firstRequestTime + 100)

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

  describe('update cache', () => {
    beforeAll(() => {
      jest.setTimeout(5 * minute)
    })
    afterAll(() => {
      jest.setTimeout(5000)
    })

    test('profile + no subscriptions', async () => {
      const firstRequestTime = 1000000000
      mockTime(firstRequestTime)

      await services.updateCache(ADDRESSES[0])

      const db1 = await getDb()
      expect(!!db1.profiles['0x79d5c59a00d65ea9ac571ad67db5a8f3afabacea']).toEqual(true)
      expect(!!db1.profiles['Antwan.Stamm']).toEqual(true)
    })

    test('no profile + subscriptions', async () => {
      const firstRequestTime = 1000000000
      mockTime(firstRequestTime)

      // subsribe first
      for (const publisher of PUBLISHERS) {
        await services.subscribe(publisher)
      }

      await services.updateCache()
      const db1 = await getDb()
      expect(db1.backgroundFeed.posts.length).toEqual(500)
    })
  })

  describe('get feed', () => {
    beforeAll(() => {
      jest.setTimeout(5 * minute)
    })
    afterAll(() => {
      jest.setTimeout(5000)
    })

    const publishers = ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222', 'john', 'john2', 'john3', 'john4', 'john5', 'john6', 'john7', 'john8', 'john9', 'john10', 'john11', 'john12', 'john13', 'john14', 'john15', 'john16', 'john17', 'john18']

    test('background cache is null', async () => {
      // first request with empty active cache
      const firstRequestTime = 1000000000
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
      const {postIds: db1PostIds, nextPublishers: db1NextPublishers, nextStartAts: db1NextStartAts} = db1.activeFeed.nextCache // eslint-disable-line

      for (const post of db1Posts) {
        testPost(post)
      }
      for (const postId of db1PostIds) {
        testPostId(postId)
      }
      expect(db1Posts.length).toEqual(feedCacheBufferSize)
      expect(publishers).toEqual(db1NextPublishers)
      expect(db1Posts[0].timestamp >= db1Posts[1].timestamp && db1Posts[0].timestamp >= db1Posts[feedCacheBufferSize - 1].timestamp).toEqual(true)
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

      const db3 = await getDb()
      expect(db3).not.toEqual(db1)
      expect(db3).not.toEqual(db2)

      const {hasMorePosts: db3HasMorePosts, lastActiveFeedCacheTimestamp: db3LastFeedCacheTimestamp, posts: db3Posts} = db3.activeFeed
      const {postIds: db3PostIds, nextPublishers: db3NextPublishers, nextStartAts: db3NextStartAts} = db3.activeFeed.nextCache // eslint-disable-line

      for (const post of db3Posts) {
        testPost(post)
      }
      for (const postId of db3PostIds) {
        testPostId(postId)
      }
      expect(db3Posts.length).toEqual(feedCacheBufferSize + limit)
      expect(publishers).toEqual(db3NextPublishers)
      expect(db3Posts[0].timestamp >= db3Posts[1].timestamp && db3Posts[0].timestamp >= db3Posts[feedCacheBufferSize - 1].timestamp).toEqual(true)
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
      const {postIds: db4PostIds, nextPublishers: db4NextPublishers, nextStartAts: db4NextStartAts} = db4.activeFeed.nextCache // eslint-disable-line

      for (const post of db4Posts) {
        testPost(post)
      }
      for (const postId of db4PostIds) {
        testPostId(postId)
      }
      expect(db4Posts.length).toEqual(feedCacheBufferSize)
      expect(publishers).toEqual(db1NextPublishers)
      expect(db4Posts[0].timestamp >= db4Posts[1].timestamp && db4Posts[0].timestamp >= db4Posts[feedCacheBufferSize - 1].timestamp).toEqual(true)
      expect(db4HasMorePosts).toEqual(true)
      expect(db4LastFeedCacheTimestamp).toEqual(firstRequestTime + feedCacheTime + minute)
    })

    test('is first page, background cache switch to active cache, and expires', async () => {
      const firstRequestTime = 1000000000
      mockTime(firstRequestTime)

      // set background cache
      await cache.updateBackgroundFeedCache(publishers)

      const db1 = await getDb()
      const {hasMorePosts: db1HasMorePosts, lastBackgroundFeedCacheTimestamp: db1LastFeedCacheTimestamp, posts: db1Posts} = db1.backgroundFeed
      const {postIds: db1PostIds, nextPublishers: db1NextPublishers, nextStartAts: db1NextStartAts} = db1.backgroundFeed.nextCache // eslint-disable-line

      for (const post of db1Posts) {
        testPost(post)
      }
      for (const postId of db1PostIds) {
        testPostId(postId)
      }
      expect(db1Posts.length).toEqual(feedCacheBufferSize)
      expect(publishers).toEqual(db1NextPublishers)
      expect(db1Posts[0].timestamp >= db1Posts[1].timestamp && db1Posts[0].timestamp >= db1Posts[feedCacheBufferSize - 1].timestamp).toEqual(true)
      expect(db1HasMorePosts).toEqual(true)
      expect(db1LastFeedCacheTimestamp).toEqual(firstRequestTime)

      const startAt = 0
      const limit = 20
      mockTime(firstRequestTime + minute)

      // since the update cache doesn't trigger, there's no need for a callback
      // background cache switch to active cache
      const res2 = await services.getFeed({subscriptions: publishers, startAt, limit})
      expect(res2.length).toEqual(limit)
      expect(res2[0].timestamp >= res2[1].timestamp && res2[0].timestamp >= res2[19].timestamp).toEqual(true)
      for (const post of res2) {
        testPost(post)
      }

      const db2 = await getDb()

      // the db2 should now contain an active feed cache,
      // which is a copy of the background feed cache
      // except the timestamp, which will change
      expect(db2.activeFeed.posts).toEqual(db1.backgroundFeed.posts)
      expect(db2.activeFeed.nextCache).toEqual(db1.backgroundFeed.nextCache)
      expect(db2.activeFeed.hasMorePosts).toEqual(db1.backgroundFeed.hasMorePosts)

      // backgroundFeed should remain the same
      expect(db2.backgroundFeed).toEqual(db1.backgroundFeed)
      expect(db2).not.toEqual(db1)

      // background cache is expired and not used
      mockTime(firstRequestTime + feedCacheTime + minute)

      // the only way we know that this test work is because of the callback
      // if the callback isn't triggered then the test will fail
      // and timeout
      let res3
      await new Promise(async resolve => {
        res3 = await services.getFeed({subscriptions: publishers, startAt, limit}, resolve)
      })

      // res should be the same but that's
      // only because there's no new posts in the tests
      // in practice it would not be the same if new
      // posts were added
      expect(res3).toEqual(res2)
    })

    test('has no more posts', async () => {
      const firstRequestTime = 1000000000
      mockTime(firstRequestTime)

      const publishers = ['john']

      // set background cache
      await cache.updateBackgroundFeedCache(publishers)

      const db1 = await getDb()

      const {hasMorePosts: db1HasMorePosts, lastBackgroundFeedCacheTimestamp: db1LastFeedCacheTimestamp, posts: db1Posts} = db1.backgroundFeed
      const {postIds: db1PostIds, nextPublishers: db1NextPublishers, nextStartAts: db1NextStartAts} = db1.backgroundFeed.nextCache // eslint-disable-line

      for (const post of db1Posts) {
        testPost(post)
      }
      for (const postId of db1PostIds) {
        testPostId(postId)
      }
      expect(db1Posts.length).not.toEqual(feedCacheBufferSize)
      expect(publishers).toEqual(publishers)
      expect(db1Posts[0].timestamp >= db1Posts[1].timestamp).toEqual(true)
      expect(db1HasMorePosts).toEqual(false)
      expect(db1LastFeedCacheTimestamp).toEqual(firstRequestTime)

      const startAt = 0
      const limit = 20

      // background cache switch to active cache
      const res2 = await services.getFeed({subscriptions: publishers, startAt, limit})
      expect(res2.length).toEqual(limit)

      // get a request halfway above the posts available
      const postsAvailable = db1Posts.length
      const res3 = await services.getFeed({subscriptions: publishers, startAt: postsAvailable - 5, limit})
      expect(res3.length).toEqual(5)

      // get a request above the posts available
      const res4 = await services.getFeed({subscriptions: publishers, startAt: postsAvailable + 5, limit})
      expect(res4.length).toEqual(0)
    })

    test('edge case that causes duplicates', async () => {
      services.mockSmartContracts({explicit: true})
      // there is a bug in the non-explicit mock that causes
      // this test to print duplicates. This problem should
      // be isolated to the non-explicit mock since the explicit
      // mock passes the test. The way the non-explicit mock is
      // created makes it impossible to fix.

      const publishers = {'0xff7b4f3915077dad912eefd75899d30508add30b': {}, '0x9133df4d9bc01c2ea494d61522cb8264a8033165': {}, '0x43e6250b43f323c94234f519e1a98931f72c3604': {}, '0x8d7ed875687afaa0947a28cc10d34e623f3079e7': {}, '0x93da5171235db03a0be2f8afe536c96852b8c4f4': {}, '0xe7176082f775ff9bc18b6682c4b46b02337c6857': {}, '0x75d12d52759fa078cb34286d654395d0a72ce44e': {}, '0xdacefd7859cb53871a0c9808cee2bdee09e45270': {}, '0xdb44af5e3395a534ac4a0225a9de095bcd91a42d': {}, '0xc53b3828f2c702df2a88a0ccc5bffdbbca413bea': {}, '0xcb9bb73bb7bb01f717cf8eb90ca34002fd277280': {}, '0x34dc95d009f5ea13dc38d7a4d9d5e876b92cb8ca': {}, '0x8dd2aec45fc3a63b612c4b2e454b6c42f4a897aa': {}, '0xd49fcc4daf0b160f804ae71492e5229185c653cb': {}, '0xb7dccb13b8f42add9fe6ff1b38f4ede8e48193e2': {}, '0xcf92113ac8547f953a53f05f96e716779877d412': {}, '0x5a01ff24e2761f671fecd1f86d2dc4cc4b175609': {}, '0x9bc2567ae9bcf493d656df788394001b0e29df60': {}, '0x48ab44430863c4aa2a086b435414eebb1f136ba0': {}, '0x500ecc47dbdd69847c616f79a238376514dcedda': {}, '0x1f5d92729b2cbec8e650ef9664549af450e0e7ce': {}, '0x236d6493352916296ede987a8e66be60eeddb0e1': {}, '0x237ab02648849cd2f127de92065073740c4dec30': {}, '0xd5f2b49887d66b49f548f0d5d95b9ccdc43e4804': {}, '0x086d270cfd64d63b836f4fa89c3028980522c8df': {}, '0xd7a2e1218d884df48dc90427cbc74cee3b8a4d41': {}, '0xd8668e7493b81f9b3cbd76e087a4ce95226b4dc8': {}, '0x49e3c51268127ce8d1060141e2c3365a9c43973a': {}, '0x1dfe76e324e8762b6278c4f527b50d562794c6b5': {}, '0x7625c63aa1286e0fc391641d1c0d36c644851893': {}, '0xb6d61a000e6457760cc8f4a4884c93195ecc7780': {}, '0xcea77b13b4c024d93db6a24ba9dc70ac0ccbf98a': {}, '0x2661a0806584bab009eeb44c4122e25b075a9214': {}, '0x985a7453aac61a381a9a815c1dcec49d380a7692': {}, '0x60b75f21b300131217495dd4d09fe131974b00e9': {}, '0x6ec3904127988d7da9522d61d9e44c47136e46b3': {}, '0x037fa8cbc63d782e0d532b2b6c2af93582220c42': {}, '0x905f0019a4ce63992f7a346da05360562b9752c9': {}, '0x1710b91201626a105ab95e76dec2db53e53e47ef': {}, '0xd0d55db70f58a00eefd7812d0e3bab49f5eaf7e4': {}, '0x191a1f57662c000f9643538860a1b686834a6a2d': {}, '0xf8fc0f1b369797e815b385f3b8c11fe2b08296c5': {}, '0xc978867f028e9e702baaa1a8d1f95eda218d831f': {}, '0xd609e2dadac3f661b21cca2f146236c344b63281': {}, '0x84785cea2f47b614c5d995181601660395856e40': {}, '0xd4111af1c571e5408291cec65b6cb4f859688d80': {}, '0xf6a70e0f06538d72344b8e0e6cabaa13e90cde3e': {}, '0x5f80dece88862a78a63c9e4c5d87c96d65eaf63d': {}, '0x16e72a33126a535878d632abf88b118f93a905a5': {}, '0x39cbe507423987772290a5d6373955b56b034f1f': {}, '0xf096f39e9266f969487468f999a5b8ecb46a43b3': {}, '0xc0f4bdb280732d629d4d54f3c513e15b67725823': {}, '0x64cc6e861a3d7f962a4646afe4b595eb523c98a2': {}, '0x50399068f6d8a253ba69325cb43976a878204228': {}, '0x3cad1d2f16bef5f9661dc1360420664efcf4942e': {}, '0xd8f7aa402856237659181a76af4cba20054e115d': {}, '0xd62971f919970ea28022e04c65ab5cf920a724c2': {}, '0xa195e50d374598379e2f7a1612a84175e10112b3': {}, '0x975e73fa6d2daa742215932723e2c54f6f40f5a3': {}, '0x9ab455a6b585dc578cc39d03428e8f69d33926be': {}, '0xe777b07c45da51974e367ed580dace48c3d256c8': {}, '0xd4d0a28a194f56c98af9a40b7a4a6f8436204fc7': {}, '0xe2c77df9bc6e85665be6330ba61e772e480dde00': {}, '0xf2a4fa2beba4a8e15a27372461148d801cc1081b': {}, '0xff36546a93206977781e9fcd07d1b66ddd9bd03c': {}, '0xc302ef2c2d2e768b7a6f55810e77d5010ae477e3': {}, '0x2f51485b81f508b709e1c4e1425125930ad08f8c': {}, '0xc8948071e25fd336c183e0560a4576e305ef46e4': {}, '0x87501249b4e7f1396f45315dbe03f3a11bcc835c': {}, '0x0f3d95c470052f00943ba962f6977a27b0d0092a': {}, '0xff8fd51e6725c9e7c6857511249aa3f8c5d15b70': {}, '0x4a81956a8c25151406302d4c9be106aa5e385236': {}, '0x22536d25a4c1db08d9bdbab2130a98631f1d382a': {}, '0x7bc96f4b8bd50482aa3faf211508dd7aeb5bac30': {}, '0x3e65edb397487a129f6b44d897fcaea4cf28c2bd': {}, '0xd0c3f5aea591477afdcadc9e8932bb8046960d57': {}, '0x2a7e886eed9dc8eecb0702088cda29ac74e8f9b9': {}, '0xa393daeed9bcbce89374e7ed519be001df8fb019': {}, '0x0e6aac34ff5bd364d259d7fbce02f5cc3d4fd304': {}, '0xa36ca7dd8fb977a4d7fae008ec1788f6c599123b': {}, '0x32ea0abf1b70384e70501f418aeea687244e2c81': {}, '0x6f4d5eeb2833a4f74161dd2cd66532c1acef8c8b': {}, '0x9322265dbfdacff7b097d2c4df1c5644b0542f68': {}, '0x0039e5e2a3dc57ea76ca2336441d2367fd84add7': {}, '0x350b23296a9454dfe76cde0d125dc66f8889d0cd': {}, '0x8c6615c347f300888f508a6ba0fa0f8126ac94c4': {}, '0xe79083cb45229ac97f00da5fc14963ab366f0fac': {}, '0xe115708cbf2dbaff225ad8ec2667e10fda5de9a2': {}, '0x9191ec7accf4f18d63bc2600ebe67ad8866d50a7': {}, '0x99e1759374d36bb7f3ae8b100378beb76ce6199a': {}, '0xeb7ca6f03236630084999f732dd8df2af694c254': {}, '0xf951f192555bc67c33e1ccaa642014d6545430c3': {}, '0xc06881a59370fa08e62d28a046b4f255073be4f5': {}, '0x305b37e65ef2e034428052438f8435ce179db861': {}, '0xd04bf19689292173fcb1e2b59e975a9ff2b239a7': {}, '0x1b735f422711b776af2b76efbb92856769846205': {}, '0x263f8f8d2fba0fcbd6ac58bfa93d1113862ba301': {}, '0xdb34fdab8f8996e28005da35626d8decf009f167': {}, '0xa71b89061bcdd3ad461dec6aea0567cd2deb5a68': {}, '0x48d61b26a39ac7a8b85837d1074704d95e18ea04': {}, '0x91c285a233a505063eb256124a1505adc8d2ccd5': {}, '0xcf2272ad0aa0ea95083d4ed802597c022dccb537': {}, '0x186d0083a26070f3a93c81cffeaddbda096002aa': {}, '0x68fb3b36248ca59e7cf8727651e78ae3b8952e5d': {}, '0xce0807d00dc0ee6133e9c334243f9587d9ff5577': {}, '0x4513e4b923323eff8f495654bfbdd9c52f3b61d0': {}, '0x99db14927e2ef8a2b341a641229eb65f851befc5': {}, '0x254db57c6ff19fe3f129f8d90c4fb0aa19602173': {}, '0x07d3f1007de150a9cf3f9c111ad2978557d51286': {}, '0x18228987d91f592d6df8ac14d5143fbdbae9ccef': {}, '0x1c760aae3afd25f220cd6b755e3616fee72033cd': {}, '0x7891775a6bfa36ccde1ee6cbca576ff2ba66a2f3': {}, '0x709b0ec66f14613f372ce52af31e2f666d851306': {}, '0xbd75e2cea372a1935845ae22a9085fa2ced276fa': {}, '0xa16f0b52cfc4d345fc5270899a867ddd185eb5fc': {}, '0xf2eb32da59de0d1bed47b64717d3b9f461ae7cfe': {}, '0xf18d2bbb8b202830e212e450265e4bbea123510f': {}, '0xfa3d7c762541d7d1a7421379c9bdb26157d3ea5c': {}, '0x1edf17fccea6da227f2f16063865664d65cc7091': {}, '0x16ad7cb82c25c7174eaa9618c156c618ca4b6a33': {}, 'Lacey.Gibson': {}, 'Aiyana.Harvey19': {}, Hulda2: {}, Markus39: {}, Aric26: {}, 'Mervin.Romaguera': {}, 'Regan.Beer95': {}, Rashad47: {}, 'Tracey.Hermann': {}, 'Clair.Thompson': {}, 'Howell.Wiza51': {}, Alize_Schinner: {}, 'Ara.Abshire': {}, Max_Fritsch: {}, Orville85: {}, Reynold96: {}, Hope11: {}, 'Jaquelin.Hermann54': {}, Athena_Cronin91: {}, 'Enid.Casper62': {}, Hobart28: {}, Melyssa39: {}, Muhammad13: {}, Jettie71: {}, 'Gunner.Barton48': {}, Olin81: {}, Clare_Hahn: {}, Benny_Farrell20: {}, Rosalinda_Hilpert76: {}, Stephania48: {}, Reggie61: {}, Erin_Dach: {}, 'Libby.Jast1': {}, Jennie_Ruecker54: {}, 'Darryl.McClure94': {}, 'Geovanny.Rowe': {}, Mariah70: {}, 'Enos.Anderson': {}, Keshawn67: {}, 'Ewald.Feest61': {}, Garnet_Morissette: {}, Nicolette_Ullrich75: {}, Patricia71: {}, Justen_Tillman: {}, Marielle85: {}, 'Blanca.Jacobi': {}, 'Violette.Hackett': {}, Annette_Lakin68: {}, Kurt_Heidenreich75: {}, Gerda_Sipes0: {}, Nathanial99: {}, 'Alvina.Lowe68': {}, Juanita61: {}, Luis_Larson92: {}, Hildegard27: {}, 'Ofelia.Batz45': {}, Juwan_Reichert9: {}, Marshall_Towne72: {}, 'Norene.Greenholt': {}, Celine_Stroman: {}, Zachary_Reichel: {}, Rey4: {} }
      const startAt = 0
      const limit = 500

      let res
      await new Promise(async resolve => {
        res = await services.getFeed({subscriptions: publishers, startAt, limit}, resolve)
      })
      const db = await getDb()

      const duplicates = getDuplicatePosts(db.activeFeed.posts)
      expect(duplicates.length).toEqual(0)

      const duplicates2 = getDuplicatePosts(res)
      expect(duplicates2.length).toEqual(0)
    })

    test('edge case that causes duplicates 2', async () => {
      services.mockSmartContracts({explicit: true})
      // there is a bug in the non-explicit mock that causes
      // this test to print duplicates. This problem should
      // be isolated to the non-explicit mock since the explicit
      // mock passes the test. The way the non-explicit mock is
      // created makes it impossible to fix.

      const publishers = {'asdfasdf': {}, 'asdfasdfasdf': {}, '0xff7b4f3915077dad912eefd75899d30508add30b': {}, '0x9133df4d9bc01c2ea494d61522cb8264a8033165': {}, '0x43e6250b43f323c94234f519e1a98931f72c3604': {}, '0x8d7ed875687afaa0947a28cc10d34e623f3079e7': {}, '0x93da5171235db03a0be2f8afe536c96852b8c4f4': {}, '0xe7176082f775ff9bc18b6682c4b46b02337c6857': {}, '0x75d12d52759fa078cb34286d654395d0a72ce44e': {}, '0xdacefd7859cb53871a0c9808cee2bdee09e45270': {}, '0xdb44af5e3395a534ac4a0225a9de095bcd91a42d': {}, '0xc53b3828f2c702df2a88a0ccc5bffdbbca413bea': {}, '0xcb9bb73bb7bb01f717cf8eb90ca34002fd277280': {}, '0x34dc95d009f5ea13dc38d7a4d9d5e876b92cb8ca': {}, '0x8dd2aec45fc3a63b612c4b2e454b6c42f4a897aa': {}, '0xd49fcc4daf0b160f804ae71492e5229185c653cb': {}, '0xb7dccb13b8f42add9fe6ff1b38f4ede8e48193e2': {}, '0xcf92113ac8547f953a53f05f96e716779877d412': {}, '0x5a01ff24e2761f671fecd1f86d2dc4cc4b175609': {}, '0x9bc2567ae9bcf493d656df788394001b0e29df60': {}, '0x48ab44430863c4aa2a086b435414eebb1f136ba0': {}, '0x500ecc47dbdd69847c616f79a238376514dcedda': {}, '0x1f5d92729b2cbec8e650ef9664549af450e0e7ce': {}, '0x236d6493352916296ede987a8e66be60eeddb0e1': {}, '0x237ab02648849cd2f127de92065073740c4dec30': {}, '0xd5f2b49887d66b49f548f0d5d95b9ccdc43e4804': {}, '0x086d270cfd64d63b836f4fa89c3028980522c8df': {}, '0xd7a2e1218d884df48dc90427cbc74cee3b8a4d41': {}, '0xd8668e7493b81f9b3cbd76e087a4ce95226b4dc8': {}, '0x49e3c51268127ce8d1060141e2c3365a9c43973a': {}, '0x1dfe76e324e8762b6278c4f527b50d562794c6b5': {}, '0x7625c63aa1286e0fc391641d1c0d36c644851893': {}, '0xb6d61a000e6457760cc8f4a4884c93195ecc7780': {}, '0xcea77b13b4c024d93db6a24ba9dc70ac0ccbf98a': {}, '0x2661a0806584bab009eeb44c4122e25b075a9214': {}, '0x985a7453aac61a381a9a815c1dcec49d380a7692': {}, '0x60b75f21b300131217495dd4d09fe131974b00e9': {}, '0x6ec3904127988d7da9522d61d9e44c47136e46b3': {}, '0x037fa8cbc63d782e0d532b2b6c2af93582220c42': {}, '0x905f0019a4ce63992f7a346da05360562b9752c9': {}, '0x1710b91201626a105ab95e76dec2db53e53e47ef': {}, '0xd0d55db70f58a00eefd7812d0e3bab49f5eaf7e4': {}, '0x191a1f57662c000f9643538860a1b686834a6a2d': {}, '0xf8fc0f1b369797e815b385f3b8c11fe2b08296c5': {}, '0xc978867f028e9e702baaa1a8d1f95eda218d831f': {}, '0xd609e2dadac3f661b21cca2f146236c344b63281': {}, '0x84785cea2f47b614c5d995181601660395856e40': {}, '0xd4111af1c571e5408291cec65b6cb4f859688d80': {}, '0xf6a70e0f06538d72344b8e0e6cabaa13e90cde3e': {}, '0x5f80dece88862a78a63c9e4c5d87c96d65eaf63d': {}, '0x16e72a33126a535878d632abf88b118f93a905a5': {}, '0x39cbe507423987772290a5d6373955b56b034f1f': {}, '0xf096f39e9266f969487468f999a5b8ecb46a43b3': {}, '0xc0f4bdb280732d629d4d54f3c513e15b67725823': {}, '0x64cc6e861a3d7f962a4646afe4b595eb523c98a2': {}, '0x50399068f6d8a253ba69325cb43976a878204228': {}, '0x3cad1d2f16bef5f9661dc1360420664efcf4942e': {}, '0xd8f7aa402856237659181a76af4cba20054e115d': {}, '0xd62971f919970ea28022e04c65ab5cf920a724c2': {}, '0xa195e50d374598379e2f7a1612a84175e10112b3': {}, '0x975e73fa6d2daa742215932723e2c54f6f40f5a3': {}, '0x9ab455a6b585dc578cc39d03428e8f69d33926be': {}, '0xe777b07c45da51974e367ed580dace48c3d256c8': {}, '0xd4d0a28a194f56c98af9a40b7a4a6f8436204fc7': {}, '0xe2c77df9bc6e85665be6330ba61e772e480dde00': {}, '0xf2a4fa2beba4a8e15a27372461148d801cc1081b': {}, '0xff36546a93206977781e9fcd07d1b66ddd9bd03c': {}, '0xc302ef2c2d2e768b7a6f55810e77d5010ae477e3': {}, '0x2f51485b81f508b709e1c4e1425125930ad08f8c': {}, '0xc8948071e25fd336c183e0560a4576e305ef46e4': {}, '0x87501249b4e7f1396f45315dbe03f3a11bcc835c': {}, '0x0f3d95c470052f00943ba962f6977a27b0d0092a': {}, '0xff8fd51e6725c9e7c6857511249aa3f8c5d15b70': {}, '0x4a81956a8c25151406302d4c9be106aa5e385236': {}, '0x22536d25a4c1db08d9bdbab2130a98631f1d382a': {}, '0x7bc96f4b8bd50482aa3faf211508dd7aeb5bac30': {}, '0x3e65edb397487a129f6b44d897fcaea4cf28c2bd': {}, '0xd0c3f5aea591477afdcadc9e8932bb8046960d57': {}, '0x2a7e886eed9dc8eecb0702088cda29ac74e8f9b9': {}, '0xa393daeed9bcbce89374e7ed519be001df8fb019': {}, '0x0e6aac34ff5bd364d259d7fbce02f5cc3d4fd304': {}, '0xa36ca7dd8fb977a4d7fae008ec1788f6c599123b': {}, '0x32ea0abf1b70384e70501f418aeea687244e2c81': {}, '0x6f4d5eeb2833a4f74161dd2cd66532c1acef8c8b': {}, '0x9322265dbfdacff7b097d2c4df1c5644b0542f68': {}, '0x0039e5e2a3dc57ea76ca2336441d2367fd84add7': {}, '0x350b23296a9454dfe76cde0d125dc66f8889d0cd': {}, '0x8c6615c347f300888f508a6ba0fa0f8126ac94c4': {}, '0xe79083cb45229ac97f00da5fc14963ab366f0fac': {}, '0xe115708cbf2dbaff225ad8ec2667e10fda5de9a2': {}, '0x9191ec7accf4f18d63bc2600ebe67ad8866d50a7': {}, '0x99e1759374d36bb7f3ae8b100378beb76ce6199a': {}, '0xeb7ca6f03236630084999f732dd8df2af694c254': {}, '0xf951f192555bc67c33e1ccaa642014d6545430c3': {}, '0xc06881a59370fa08e62d28a046b4f255073be4f5': {}, '0x305b37e65ef2e034428052438f8435ce179db861': {}, '0xd04bf19689292173fcb1e2b59e975a9ff2b239a7': {}, '0x1b735f422711b776af2b76efbb92856769846205': {}, '0x263f8f8d2fba0fcbd6ac58bfa93d1113862ba301': {}, '0xdb34fdab8f8996e28005da35626d8decf009f167': {}, '0xa71b89061bcdd3ad461dec6aea0567cd2deb5a68': {}, '0x48d61b26a39ac7a8b85837d1074704d95e18ea04': {}, '0x91c285a233a505063eb256124a1505adc8d2ccd5': {}, '0xcf2272ad0aa0ea95083d4ed802597c022dccb537': {}, '0x186d0083a26070f3a93c81cffeaddbda096002aa': {}, '0x68fb3b36248ca59e7cf8727651e78ae3b8952e5d': {}, '0xce0807d00dc0ee6133e9c334243f9587d9ff5577': {}, '0x4513e4b923323eff8f495654bfbdd9c52f3b61d0': {}, '0x99db14927e2ef8a2b341a641229eb65f851befc5': {}, '0x254db57c6ff19fe3f129f8d90c4fb0aa19602173': {}, '0x07d3f1007de150a9cf3f9c111ad2978557d51286': {}, '0x18228987d91f592d6df8ac14d5143fbdbae9ccef': {}, '0x1c760aae3afd25f220cd6b755e3616fee72033cd': {}, '0x7891775a6bfa36ccde1ee6cbca576ff2ba66a2f3': {}, '0x709b0ec66f14613f372ce52af31e2f666d851306': {}, '0xbd75e2cea372a1935845ae22a9085fa2ced276fa': {}, '0xa16f0b52cfc4d345fc5270899a867ddd185eb5fc': {}, '0xf2eb32da59de0d1bed47b64717d3b9f461ae7cfe': {}, '0xf18d2bbb8b202830e212e450265e4bbea123510f': {}, '0xfa3d7c762541d7d1a7421379c9bdb26157d3ea5c': {}, '0x1edf17fccea6da227f2f16063865664d65cc7091': {}, '0x16ad7cb82c25c7174eaa9618c156c618ca4b6a33': {}, 'Lacey.Gibson': {}, 'Aiyana.Harvey19': {}, 'Hulda2': {}, 'Markus39': {}, 'Aric26': {}, 'Mervin.Romaguera': {}, 'Regan.Beer95': {}, 'Rashad47': {}, 'Tracey.Hermann': {}, 'Clair.Thompson': {}, 'Howell.Wiza51': {}, 'Alize_Schinner': {}, 'Ara.Abshire': {}, 'Max_Fritsch': {}, 'Orville85': {}, 'Reynold96': {}, 'Hope11': {}, 'Jaquelin.Hermann54': {}, 'Athena_Cronin91': {}, 'Enid.Casper62': {}, 'Hobart28': {}, 'Melyssa39': {}, 'Muhammad13': {}, 'Jettie71': {}, 'Gunner.Barton48': {}, 'Olin81': {}, 'Clare_Hahn': {}, 'Benny_Farrell20': {}, 'Rosalinda_Hilpert76': {}, 'Stephania48': {}, 'Reggie61': {}, 'Erin_Dach': {}, 'Libby.Jast1': {}, 'Jennie_Ruecker54': {}, 'Darryl.McClure94': {}, 'Geovanny.Rowe': {}, 'Mariah70': {}, 'Enos.Anderson': {}, 'Keshawn67': {}, 'Ewald.Feest61': {}, 'Garnet_Morissette': {}, 'Nicolette_Ullrich75': {}, 'Patricia71': {}, 'Justen_Tillman': {}, 'Marielle85': {}, 'Blanca.Jacobi': {}, 'Violette.Hackett': {}, 'Annette_Lakin68': {}, 'Kurt_Heidenreich75': {}, 'Gerda_Sipes0': {}, 'Nathanial99': {}, 'Alvina.Lowe68': {}, 'Juanita61': {}, 'Luis_Larson92': {}, 'Hildegard27': {}, 'Ofelia.Batz45': {}, 'Juwan_Reichert9': {}, 'Marshall_Towne72': {}, 'Norene.Greenholt': {}, 'Celine_Stroman': {}, 'Zachary_Reichel': {}, 'Rey4': {}}
      const startAt = 0
      const limit = 10

      let res
      await new Promise(async resolve => {
        res = await services.getFeed({subscriptions: publishers, startAt, limit}, resolve)
      })
      const db = await getDb()

      const duplicates = getDuplicatePosts(db.activeFeed.posts)
      expect(duplicates.length).toEqual(0)

      const duplicates2 = getDuplicatePosts(res)
      expect(duplicates2.length).toEqual(0)
    })
  })
})
