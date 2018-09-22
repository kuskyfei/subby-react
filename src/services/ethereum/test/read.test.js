/* eslint-env jest */

import {
  getProfile,
  getAddress,
  getSubscriptions,
  getPosts,
  onCategoryPost
} from '../index'

import {__private__} from '../read'

const ms = require('ms')

describe('ethereum read mocks', () => {
  beforeAll(() => {

  })

  afterAll(() => {

  })

  test('get address', async () => {
    const address = await getAddress()

    const res = '0x0cd350b97786c48444611381b95b820222532311'
    expect(address).toEqual(res)
  })
/*
  test('get profile', async () => {
    const profile = await getProfile({username: 'test'})
    const profile2 = await getProfile({address: 'test'})

    const res = {'address': '0x0cd350b97786c48444611381b95b820222532311', 'bio': 'Facere cumque repellat omnis accusamus aut et est. Deserunt aut repudiandae dignissimos omnis in velit aut. Molestiae omnis nihil quis dolorum. celestine.name', 'subscriberCount': 17157, 'subscriptionCount': 64310, 'thumbnail': 'https://i.imgur.com/359os81.jpg', 'tipCount': 53119, 'username': 'test'}
    const res2 = {'address': 'test', 'bio': 'Facere cumque repellat omnis accusamus aut et est. Deserunt aut repudiandae dignissimos omnis in velit aut. Molestiae omnis nihil quis dolorum. celestine.name', 'subscriberCount': 17157, 'subscriptionCount': 64310, 'thumbnail': 'https://i.imgur.com/359os81.jpg', 'tipCount': 53119, 'username': 'Celestine_OReilly99'}

    expect(profile).toEqual(res)
    expect(profile2).toEqual(res2)
  })

  test('get subscriptions', async () => {
    const subs = await getSubscriptions({username: 'test'})
    const subsKeys = Object.keys(subs)
    const subs2 = await getSubscriptions({address: 'test2'})
    const subs2Keys = Object.keys(subs2)

    expect(subsKeys.length).toEqual(467)
    expect(subsKeys[0]).toEqual('Tobin.Swift')

    expect(subs2Keys.length).toEqual(1039)
    expect(subs2Keys[0]).toEqual('Hadley_Gorczany')
  })

  test('get posts from a single subscription', async () => {
    const posts = __private__.getMockPosts('test')

    expect(posts.length).toEqual(7)
    expect(posts[0].link).toEqual('https://www.facebook.com/refinery29/posts/10156966352367922')
    expect(posts[0].comment).toEqual('Qui id rem fuga ut.')
    expect(posts[0].category).toEqual('quaerat')
  })

  test('get posts from subscriptions', async () => {
    const beforeTimestamp = Date.now()
    const afterTimestamp = beforeTimestamp - ms('7 days')
    const count = 20

    const posts = await getPosts({
      startAt: 10,
      count,
      beforeTimestamp,
      afterTimestamp,
      userSubscriptions: ['test', 'test2', 'test3', 'test4', 'test5'],
      addressSubscriptions: ['test6', 'test7', 'test8', 'test9']
    })

    expect(posts.length).toEqual(count)
    expect(posts[0].timestamp < beforeTimestamp).toEqual(true)
    expect(posts[count - 1].timestamp > afterTimestamp).toEqual(true)

    expect(posts[0].link).toEqual('https://vimeo.com/131376602')
    expect(posts[0].comment).toEqual('Excepturi molestiae aliquid ea.')
    expect(posts[0].category).toEqual('dolore')
  })

  test('onCategoryPost get category post', async () => {
    const posts = []

    await onCategoryPost('testCategory', (post) => {
      posts.push(post)
    })

    expect(posts.length).toEqual(45)
    expect(posts[0].link).toEqual('https://www.facebook.com/refinery29/posts/10156966039962922')
    expect(posts[0].comment).toEqual('Quo et eos sit architecto soluta.')
    expect(posts[0].category).toEqual('blanditiis')
  })
*/
})
