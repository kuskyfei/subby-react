/* eslint-env jest */

const services = require('../../services')

const reset = async () => {
  
}

describe('services', () => {
  beforeAll(async () => {
    await services.init()
    services.mockSmartContracts()
  })

  describe('get profile', () => {
    test('from address', async () => {
      // const profile = {'address': '0x79d5c59a00d65ea9ac571ad67db5a8f3afabacea', 'bio': 'Provident ducimus iure ducimus similique aut neque sunt non. Sed mollitia vel voluptates fugiat nostrum nihil expedita labore quo. Fugiat minima nisi deserunt voluptatem ullam quia. antwan.org', 'minimumTextDonation': 0.05, 'subscriberCount': 0, 'thumbnail': 'https://i.imgur.com/I5BH2CW.jpg', 'username': 'Antwan.Stamm'}

      const res = await services.getProfile('0x79d5c59a00d65ea9ac571ad67db5a8f3afabacea')
      //console.log(res)
      console.log(1)
      console.log(await window.SUBBY_DEBUG_INDEXEDDB())

      await window.SUBBY_DEBUG_DELETE_INDEXEDDB()
      await services.init()
      services.mockSmartContracts()

      console.log(2)
      console.log(await window.SUBBY_DEBUG_INDEXEDDB())

      
      // const res = await subby.getProfile(ADDRESSES[0])
      // expect(res).toEqual(profile)
      // testProfile(res)
    })

    // test('from username', async () => {
    //   const profile = {'address': '0x63e3039a5d97c9c9d2ca721d7edf96f9ca9aa379', 'bio': 'Unde ut provident autem distinctio. Possimus tempore esse dolores cum fugiat. Animi ut aut odit. Aperiam architecto est. ebony.info', 'minimumTextDonation': 0, 'subscriberCount': 28345, 'thumbnail': 'https://i.imgur.com/OfhXVF0.jpg', 'username': 'john'}

    //   const res = await subby.getProfile(USERNAMES[0])
    //   expect(res).toEqual(profile)
    //   testProfile(res)
    // })
  })

})


// const settings = await services.getSettings()

      //const address = await services.getAddress()
      // const address = '0xBD6d79F3f02584cfcB754437Ac6776c4C6E0a0eC'
      // const profile = await services.getProfile(address)

      
      //const subscriptions = await services.getSubscriptions({address})