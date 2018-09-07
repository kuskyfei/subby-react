/* eslint-env jest */

import {
  getProfileFromUsername,
  getProfileFromAddress,
  getSubscriptionsFromAddress,
  getSubscriptionsFromUsername,
  getPosts
  // post
} from './index'

import {__private__} from './read'

const ms = require('ms')

describe('ethereum read mocks', () => {
  beforeAll(() => {

  })

  afterAll(() => {

  })

  test('get profile', async () => {
    const profile = await getProfileFromUsername('test')
    const profile2 = await getProfileFromAddress('test')

    const res = {'address': '0x3meepm6zxvbo49d6jk6lfcdze1lxb7kmd', 'bio': 'Cumque repellat omnis accusamus aut et est porro deserunt. Repudiandae dignissimos omnis in velit aut ullam molestiae omnis nihil. Dolorum in architecto aliquam enim. Officiis impedit voluptate eaque. Sint ratione sunt illo eaque et. lucius.biz', 'subscriberCount': 43711, 'subscriptionCount': 48513, 'thumbail': 'https://s3.amazonaws.com/uifaces/faces/twitter/runningskull/128.jpg', 'username': 'test'}
    const res2 = {'address': 'test', 'bio': 'Et est porro. Aut repudiandae dignissimos omnis in velit aut. Molestiae omnis nihil quis dolorum. Architecto aliquam enim ipsum officiis impedit. Eaque corrupti sint ratione sunt illo. Et rerum eius. hulda.info', 'subscriberCount': 87410, 'subscriptionCount': 51688, 'thumbail': 'https://s3.amazonaws.com/uifaces/faces/twitter/tumski/128.jpg', 'username': 'Celestine_OReilly99'}

    expect(profile).toEqual(res)
    expect(profile2).toEqual(res2)
  })

  test('get subscriptions', async () => {
    const subs = await getSubscriptionsFromUsername('test')
    const subs2 = await getSubscriptionsFromAddress('test')

    expect(subs.userSubscriptions.length).toEqual(157)
    expect(subs.addressSubscriptions.length).toEqual(367)
    expect(subs2.userSubscriptions.length).toEqual(157)
    expect(subs2.addressSubscriptions.length).toEqual(367)
  })

  test('get posts from a subscriptions', async () => {
    const posts = __private__.getMockPosts('test')

    expect(Array.isArray(posts)).toEqual(true)
    expect(typeof posts[0].link).toEqual('string')
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

    expect(Array.isArray(posts)).toEqual(true)
    expect(posts.length).toEqual(count)
    expect(typeof posts[0].link).toEqual('string')
    expect(posts[0].timestamp < beforeTimestamp).toEqual(true)
    expect(posts[count - 1].timestamp > afterTimestamp).toEqual(true)
  })
})
