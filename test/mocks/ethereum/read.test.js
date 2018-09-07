/* eslint-env jest */

import {
  getProfile,
  getAddress,
  getSubscriptions,
  getPosts,
  onCategoryPost
} from './index'

import {__private__} from './read'

const ms = require('ms')

describe('ethereum read mocks', () => {
  beforeAll(() => {

  })

  afterAll(() => {

  })

  test('get address', async () => {
    const address = await getAddress()

    const res = "0x3rpzrv0nqplzwfree3axrfdme29b"
    expect(address).toEqual(res)
  })

  test('get profile', async () => {
    const profile = await getProfile({username:'test'})
    const profile2 = await getProfile({address:'test'})

    const res = {"address": "0x3rpzrv0nqplzwfree3axrfdme29b", "bio": "Facere cumque repellat omnis accusamus aut et est. Deserunt aut repudiandae dignissimos omnis in velit aut. Molestiae omnis nihil quis dolorum. celestine.name", "subscriberCount": 17157, "subscriptionCount": 64310, "thumbail": "https://s3.amazonaws.com/uifaces/faces/twitter/runningskull/128.jpg", "tipCount": 53119, "username": "test"}
    const res2 = {"address": "test", "bio": "Facere cumque repellat omnis accusamus aut et est. Deserunt aut repudiandae dignissimos omnis in velit aut. Molestiae omnis nihil quis dolorum. celestine.name", "subscriberCount": 17157, "subscriptionCount": 64310, "thumbail": "https://s3.amazonaws.com/uifaces/faces/twitter/runningskull/128.jpg", "tipCount": 53119, "username": "Celestine_OReilly99"}

    expect(profile).toEqual(res)
    expect(profile2).toEqual(res2)
  })

  test('get subscriptions', async () => {
    const subs = await getSubscriptions({username:'test'})
    const subs2 = await getSubscriptions({address:'test2'})

    expect(subs.userSubscriptions.length).toEqual(157)
    expect(subs.addressSubscriptions.length).toEqual(310)
    expect(subs.userSubscriptions[0]).toEqual('Tobin.Swift')
    expect(subs.addressSubscriptions[0]).toEqual('0x3w0ob0d4k3y1iabiyv6p5hg5ya5zgu2')

    expect(subs2.userSubscriptions.length).toEqual(119)
    expect(subs2.addressSubscriptions.length).toEqual(920)
    expect(subs2.userSubscriptions[0]).toEqual('Hadley_Gorczany')
    expect(subs2.addressSubscriptions[0]).toEqual('0x353drfrv0s9mh1rgjjzbajvrij8auii6')
  })

  test('get posts from a single subscription', async () => {
    const posts = __private__.getMockPosts('test')

    expect(posts.length).toEqual(157)
    expect(posts[0].link).toEqual('https://www.youtube.com/watch?v=EwJUveiSg8k')
    expect(posts[0].comment).toEqual('Officiis totam ut doloremque voluptas modi velit numquam reiciendis non.')
    expect(posts[0].category).toEqual('non')
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

    expect(posts[0].link).toEqual('https://www.reddit.com/r/UpliftingNews/comments/9b160a/a_teacher_sat_in_her_car_with_a_former_students/')
    expect(posts[0].comment).toEqual('Nihil nobis mollitia aut eius velit praesentium mollitia quidem sunt.')
    expect(posts[0].category).toEqual('repellat')
  })

  test('onCategoryPost get category post', async () => {
    const posts = []

    onCategoryPost('testCategory', (post) => {
      posts.push(post)
    })

    expect(posts.length).toEqual(295)
    expect(posts[0].link).toEqual('https://www.youtube.com/watch?v=WAr4YVpfpII')
    expect(posts[0].comment).toEqual('Occaecati dolore ab hic qui.')
    expect(posts[0].category).toEqual('aliquid')
  })  

})
