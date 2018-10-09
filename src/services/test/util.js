/* eslint-env jest */

const testProfile = (profile) => {
  expect(typeof profile.address).toEqual('string')
  expect(typeof profile.bio).toEqual('string')
  expect(typeof profile.minimumTextDonation).toEqual('number')
  expect(typeof profile.subscriberCount).toEqual('number')
  expect(typeof profile.username).toEqual('string')
  expect(typeof profile.thumbnail).toEqual('string')
}

const testPost = (post) => {
  expect(typeof post.address).toEqual('string')
  expect(typeof post.comment).toEqual('string')
  expect(typeof post.link).toEqual('string')
  expect(typeof post.minimumTextDonation).toEqual('number')
  expect(typeof post.thumbnail).toEqual('string')
  expect(typeof post.timestamp).toEqual('number')
  expect(typeof post.username).toEqual('string')
  expect(typeof post.id).toEqual('number')
}

const testPostId = (postId) => {
  expect(typeof postId.timestamp).toEqual('number')
  expect(typeof postId.publisher).toEqual('string')
  expect(typeof postId.id).toEqual('number')
  expect(postId.id < 0).toEqual(false)
  expect(postId.timestamp > 0).toEqual(true)
}

module.exports = {testProfile, testPost, testPostId}
