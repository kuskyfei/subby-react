import {fake, formatSubscriptions} from './util'
import urls from './urls'
let counter = 8; while (counter--) urls.imageUrls.unshift(null)

const ms = require('ms')
const {sortBy} = require('lodash')
const {networkDelayMock} = require('./util')

const getAddress = async () => {
  // await networkDelayMock()
  return '0x' + fake('test').finance.ethereumAddress()
}

const getProfile = async ({username, address}) => {
  // await networkDelayMock()

  let seed = address

  // if username is set, then address is ignored
  // completely and overwriten by the username's
  // address on Ethereum.
  if (username) {
    seed = username
    address = '0x' + fake(seed).finance.ethereumAddress()
  }

  const profile = {
    username: username || fake(seed).internet.userName(),
    thumbail: urls.imageUrls[fake(seed).random.number() % (urls.imageUrls.length - 1)],
    bio: fake(seed).lorem.paragraph() + ' ' + fake(seed).internet.domainName(),
    subscriberCount: fake(seed).random.number(),
    subscriptionCount: fake(seed + 1).random.number(),
    tipCount: fake(seed + 2).random.number(),
    address: address
  }
  return profile
}

const getSubscriptions = async ({username, address}) => {
  // await networkDelayMock()

  // if username is set, then address is ignored
  // completely and overwriten by the username's
  // address on Ethereum.
  let seed = username || address

  const userSubscriptions = []

  let counter = fake(seed).random.number() % 1000
  while (counter--) {
    userSubscriptions.push(fake(counter).internet.userName())
  }

  const addressSubscriptions = []

  counter = fake(seed + 1).random.number() % 1000
  while (counter--) {
    addressSubscriptions.push('0x' + fake(counter).finance.ethereumAddress())
  }

  const subscriptions = formatSubscriptions({userSubscriptions, addressSubscriptions})

  return subscriptions
}

// this needs to be edited to match the new getPosts algorithm
const getPosts = async ({userSubscriptions, addressSubscriptions, startAt, count, cursor, beforeTimestamp, afterTimestamp}) => {
  await networkDelayMock()

  const posts = []

  let counter = 0
  let userSubscriptionsPosts = []
  for (const sub of userSubscriptions) {
    userSubscriptionsPosts = userSubscriptionsPosts.concat(getMockPosts(sub))
    if (counter++ > 50) break
  }

  counter = 0
  let addressSubscriptionsPosts = []
  for (const sub of addressSubscriptions) {
    addressSubscriptionsPosts = addressSubscriptionsPosts.concat(getMockPosts(sub))
    if (counter++ > 50) break
  }

  const mergedPosts = userSubscriptionsPosts.concat(addressSubscriptionsPosts)

  for (const post of mergedPosts) {
    // filter posts that don't fit in correct time
    if (post.timestamp > beforeTimestamp) continue
    if (post.timestamp < afterTimestamp) continue

    posts.push(post)
  }

  const sortedPosts = sortBy(posts, 'timestamp') // older posts are at the beginning
  sortedPosts.reverse() // newer posts are at the beginning

  const filteredPosts = []

  while (count--) {
    const i = startAt + count
    filteredPosts.unshift(sortedPosts[i])
  }

  return filteredPosts
}

const getMockPosts = (seed) => {
  const posts = []

  let counter = fake(seed).random.number() % 50
  while (counter--) {
    const urlsArrays = Object.values(urls)

    const type = fake(seed + counter).random.number() % urlsArrays.length
    const i = fake(seed + counter).random.number() % urlsArrays[type].length

    const randomNumber = fake(seed + counter).random.number() % 100 / 100

    const post = {
      link: urlsArrays[type][i],
      comment: fake(seed + counter).lorem.sentence(),
      category: fake(seed + counter).lorem.word(),
      timestamp: Math.round(Date.now() - ms('30 days') * randomNumber),
      username: seed,
      thumbnail: urls.imageUrls[fake(seed).random.number() % (urls.imageUrls.length - 1)]
    }

    posts.push(post)
  }

  return posts
}

const __private__ = {
  getMockPosts: getMockPosts
}

/* usage:
  onCategoryPost('category', (post) => {
    doSomething(post)
  })
*/
const onCategoryPost = async (category, cb) => {
  await networkDelayMock()

  const posts = getMockPosts(category)

  for (const post of posts) {
    cb(post)
  }
}

export {
  __private__,
  getAddress,
  getProfile,
  getSubscriptions,
  getPosts,
  onCategoryPost
}