import urls from './urls'
import {fake} from '../util'

const util = require('util')

const ms = require('ms')
const {sortBy} = require('lodash')

const getAddress = async () => {
  return '0x' + fake('test').finance.bitcoinAddress().toLowerCase()
}

const getProfile = async ({username, address}) => {
  let seed = address

  // if username is set, then address is ignored
  // completely and overwriten by the username's
  // address on Ethereum.
  if (username) {
    seed = username
    address = '0x' + fake(seed).finance.bitcoinAddress().toLowerCase()
  }

  const profile = {
    username: username || fake(seed).internet.userName(),
    thumbail: fake(seed).internet.avatar(),
    bio: fake(seed).lorem.paragraph() + ' ' + fake(seed).internet.domainName(),
    subscriberCount: fake(seed).random.number(),
    subscriptionCount: fake(seed + 1).random.number(),
    tipCount: fake(seed + 2).random.number(),
    address: address
  }
  return profile
}

const getSubscriptions = async ({username, address}) => {
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
    addressSubscriptions.push('0x' + fake(counter).finance.bitcoinAddress().toLowerCase())
  }

  return {userSubscriptions, addressSubscriptions}
}

// this needs to be edited to match the new getPosts algorithm
const getPosts = async ({
  userSubscriptions, addressSubscriptions,
  startAt, count, cursor,
  beforeTimestamp, afterTimestamp
}) => {
  const posts = []

  let userSubscriptionsPosts
  for (const sub of userSubscriptions) {
    userSubscriptionsPosts = getMockPosts(sub)
  }

  let addressSubscriptionsPosts
  for (const sub of addressSubscriptions) {
    addressSubscriptionsPosts = getMockPosts(sub)
  }

  const mergedPosts = userSubscriptionsPosts.concat(addressSubscriptionsPosts)

  let counter = 0
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

  let counter = fake(seed).random.number() % 1000
  while (counter--) {
    const urlsArrays = Object.values(urls)

    const type = fake(counter).random.number() % urlsArrays.length
    const i = fake(counter).random.number() % urlsArrays[type].length

    const randomNumber = fake(counter).random.number() % 100 / 100

    const post = {
      link: urlsArrays[type][i],
      comment: fake(counter).lorem.sentence(),
      category: fake(counter).lorem.word(),
      timestamp: Math.round(Date.now() - ms('30 days') * randomNumber)
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
    console.log(post)
  })
*/
const onCategoryPost = (category, cb) => {
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
