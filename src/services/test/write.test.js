/* eslint-env jest */

const services = require('../../services')

const {resetDb, getDb, deepCopy} = require('./util')

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

  describe('subscribe/unsubscribe', () => {
    test('locally', async () => {
      // test subscribing locally
      for (const publisher of PUBLISHERS) {
        let isSubscribed = await services.isSubscribed({publisher, address: ADDRESSES[0]})
        expect(isSubscribed).toEqual(false)
        await services.subscribe({publisher, address: ADDRESSES[0]})
        isSubscribed = await services.isSubscribed({publisher, address: ADDRESSES[0]})
        expect(isSubscribed).toEqual(true)
      }
      const subscriptions = await services.getSubscriptions(ADDRESSES[0])

      expect(Object.keys(subscriptions.localSubscriptions).length).toEqual(PUBLISHERS.length)
      for (const publisher of PUBLISHERS) {
        expect(publisher in subscriptions.localSubscriptions).toEqual(true)
        expect(publisher in subscriptions.activeSubscriptions).toEqual(true)
      }

      // test unsubscribing locally
      const db1 = await getDb()
      await services.unsubscribe({publishers: [PUBLISHERS[0]], address: ADDRESSES[0]})
      const db2 = await getDb()

      const db1Copy = deepCopy(db1)
      delete db1Copy.localSubscriptions.subscriptions[PUBLISHERS[0]]
      expect(db2).toEqual(db1Copy)
      expect(Object.keys(db2.localSubscriptions.subscriptions).length).toEqual(Object.keys(db1.localSubscriptions.subscriptions).length - 1)
      expect(PUBLISHERS[0] in db1.localSubscriptions.subscriptions).toEqual(true)
      expect(PUBLISHERS[0] in db2.localSubscriptions.subscriptions).toEqual(false)

      for (const i in PUBLISHERS) {
        const isSubscribed = await services.isSubscribed({publisher: PUBLISHERS[i], address: ADDRESSES[0]})
        if (i === '0') {
          expect(isSubscribed).toEqual(false)
        } else {
          expect(isSubscribed).toEqual(true)
        }
      }
    })

    test('isSubscribed', async () => {
      let isSubscribed = await services.isSubscribed({publisher: PUBLISHERS[0], address: ADDRESSES[0]})
      expect(isSubscribed).toEqual(false)

      await services.subscribe({publisher: PUBLISHERS[0], address: ADDRESSES[0]})

      isSubscribed = await services.isSubscribed({publisher: PUBLISHERS[0], address: ADDRESSES[0]})
      expect(isSubscribed).toEqual(true)
    })
  })

  describe('setSubscriptions', () => {
    test('locally', async () => {
      { // test with a publishers array
        await services.setSubscriptions(PUBLISHERS)

        const subscriptions = await services.getSubscriptions()
        expect(Object.keys(subscriptions.localSubscriptions).length).toEqual(PUBLISHERS.length)
        for (const publisher of PUBLISHERS) {
          expect(publisher in subscriptions.localSubscriptions).toEqual(true)
          expect(publisher in subscriptions.activeSubscriptions).toEqual(true)
        }
      }

      { // test with an empty publisher object
        await services.setSubscriptions({})

        const subscriptions = await services.getSubscriptions()
        expect(subscriptions.localSubscriptions).toEqual({})
      }
    })
  })

  describe('setSettings', () => {
    test('locally', async () => {
      let testSettings = {
        test1: true,
        test2: true,
        test3: true
      }

      { // make sure the default settings are false
        const settings = await services.getSettings()
        expect(settings.test1).toEqual(undefined)
        expect(settings.test2).toEqual(undefined)
        expect(settings.test3).toEqual(undefined)
      }

      { // test adding arbitrary settings
        await services.setSettings(testSettings)
        const settings = await services.getSettings()
        expect(settings.test1).toEqual(true)
        expect(settings.test2).toEqual(true)
        expect(settings.test3).toEqual(true)
      }

      testSettings = {
        test1: false
      }

      { // test changing one setting only
        await services.setSettings(testSettings)
        const settings = await services.getSettings()
        expect(settings.test1).toEqual(false)
        expect(settings.test2).toEqual(true)
        expect(settings.test3).toEqual(true)
      }

      testSettings = {
        test1: true,
        test2: false,
        test4: true
      }

      { // test changing a few settings
        await services.setSettings(testSettings)
        const settings = await services.getSettings()
        expect(settings.test1).toEqual(true)
        expect(settings.test2).toEqual(false)
        expect(settings.test3).toEqual(true)
        expect(settings.test4).toEqual(true)
      }
    })

    test('use default', async () => {
      let testSettings = {
        test1: true,
        test2: true,
        test3: true
      }

      { // make sure the default settings are false
        const settings = await services.getSettings()
        expect(settings.test1).toEqual(undefined)
        expect(settings.test2).toEqual(undefined)
        expect(settings.test3).toEqual(undefined)
      }

      { // test adding arbitrary settings
        await services.setSettings(testSettings)
        const settings = await services.getSettings()
        expect(settings.test1).toEqual(true)
        expect(settings.test2).toEqual(true)
        expect(settings.test3).toEqual(true)
      }

      testSettings = {
        USE_DEFAULT_SETTINGS: true
      }

      { // test changing USE_DEFAULT_SETTINGS
        await services.setSettings(testSettings)
        const settings = await services.getSettings()
        expect(settings.test1).toEqual(undefined)
        expect(settings.test2).toEqual(undefined)
        expect(settings.test3).toEqual(undefined)
        expect(settings).toEqual({...window.SUBBY_GLOBAL_SETTINGS, USE_DEFAULT_SETTINGS: true})
      }
    })
  })
})
