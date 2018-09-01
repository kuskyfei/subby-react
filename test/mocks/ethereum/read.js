import urls from './urls'

const faker = require('faker')
const toNumber = require('hashcode').hashCode().value
const ms = require('ms')
const {sortBy} = require('lodash')

const getProfileFromUsername = async (username) => {
  const seed = toNumber(username)
  faker.seed(seed)

  const profile = {
    username: username,
    thumbail: faker.internet.avatar(),
    bio: faker.lorem.paragraph() + ' ' + faker.internet.domainName(),
    subscriberCount: faker.random.number(),
    subscriptionCount: faker.random.number(),
    address: '0x' + faker.finance.bitcoinAddress().toLowerCase()
  }
  return profile
}

const getProfileFromAddress = async (address) => {
  const seed = toNumber(address)
  faker.seed(seed)

  const profile = {
    username: faker.internet.userName(),
    thumbail: faker.internet.avatar(),
    bio: faker.lorem.paragraph() + ' ' + faker.internet.domainName(),
    subscriberCount: faker.random.number(),
    subscriptionCount: faker.random.number(),
    address: address
  }
  return profile
}

const getSubscriptionsFromUsername = async (username) => {
  const seed = toNumber(username)
  faker.seed(seed)

  const userSubscriptions = []

  let counter = faker.random.number() % 1000
  while (counter--) {
    userSubscriptions.push(faker.internet.userName())
  }

  const addressSubscriptions = []

  counter = faker.random.number() % 1000
  while (counter--) {
    addressSubscriptions.push('0x' + faker.finance.bitcoinAddress().toLowerCase())
  }

  return {userSubscriptions, addressSubscriptions}
}

const getSubscriptionsFromAddress = async (address) => {
  const seed = toNumber(address)
  faker.seed(seed)

  const userSubscriptions = []

  let counter = faker.random.number() % 1000
  while (counter--) {
    userSubscriptions.push(faker.internet.userName())
  }

  const addressSubscriptions = []

  counter = faker.random.number() % 1000
  while (counter--) {
    addressSubscriptions.push('0x' + faker.finance.bitcoinAddress().toLowerCase())
  }

  return {userSubscriptions, addressSubscriptions}
}

const getPosts = async ({startAt, count, beforeTimestamp, afterTimestamp, userSubscriptions, addressSubscriptions}) => {
  const posts = []

  for (const sub of userSubscriptions) {
    const _posts = getMockPosts(sub)

    for (const post of _posts) {
      // filter posts that don't fit in correct time
      if (post.timestamp > beforeTimestamp) continue
      if (post.timestamp < afterTimestamp) continue

      posts.push(post)
    }
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
  seed = toNumber(seed)
  faker.seed(seed)

  const posts = []

  let counter = faker.random.number() % 1000
  while (counter--) {
    const urlsArrays = Object.values(urls)

    const type = faker.random.number() % urlsArrays.length
    const i = faker.random.number() % urlsArrays[type].length

    const post = {
      link: urlsArrays[type][i],
      comment: faker.lorem.sentence(),
      category: faker.lorem.word(),
      timestamp: Math.round(Date.now() - ms('30 days') * Math.random())
    }

    posts.push(post)
  }

  return posts
}

const __private__ = {
  getMockPosts: getMockPosts
}

const post = (category) => ({
  on: (cb) => {

    // contract.events.filter(category).on('event', (event) => {
    //   cb(event)

    // })

  }
})

export {__private__, getProfileFromUsername, getProfileFromAddress, getSubscriptionsFromAddress, getSubscriptionsFromUsername, getPosts, post}
