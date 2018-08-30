##todo

- set up twitter account
- compile to single file
- set up mock API
- set up mock API for ipfs
- add global options like provider, no google analytics, etc.
- test mock api and make sure it doesn't block the main thread, maybe use web workers.
- pages
  - feeds
    - your feed ----> /feed
    - category feed ----> /category/:name
    - user profile and feed ----> /user/:username and /address/:address
    - an arbitrary user's feed ----> /user-feed/:username and /address-feed/:address
  - about / social media / team / contact ----> /about
  - disclaimer / privacy / terms
  - bulk subscribe/unsub & bulk sync ----> /bulk
  - set/view your profile ----> /profile
  - manage/import/export your subscribtions ----> /manage
  - new post

##supported embedded websites

vimeo.com
youtube.com
twitter.com
facebook.com
reddit.com
instagram.com

##supported p2p protocols

bittorrent
ipfs

##read functions

getProfileFromUsername(username)
getProfileFromAddress(address)

returns (username, thumbail, bio, subscriberCount, subscribtionCount)

getSubscriptionsFromAddress(address)
getSubscriptionsFromUsername(username)

return (subscribtions) // array of users and addresses someone is subscribed to.

##user functions

setUsername(username) // has to be unique and can never be changed.
setThumbnail("http://url.com/image.png" or "ipfs:hash") // can be changed
setBio("string" or "ipfs:hash")

##subscribe function

subscribeToUser(user)
subscribeToAddress(address)
unsubscribeToUser(user)
unsubscribeToAddress(address)

possibly make it into a single function subscribe(target, type) if having 3 functions doesn't save any gas.

possibly increment/decrement the recipient "subscriberCount", depends how much gas it costs.

note: prevent duplicate subbing to an address and username, and prevent subbing to unregistered username.

bulk functions for efficincy:

bulkSubscribe(arrayOfUsernames, arrayOfAddresses)
bulkUnsubscribe(arrayOfUsernames, arrayOfAddresses)

note: don't revert on error for bulk, just ignore errors and continue. We do need to test max numbers for these.

##publish post function

publish(postStruct)

if it saves gas, possibly do all these functions:

publishLinkComment(postStruct)
publishLinkCommentCategory(postStruct)
publishLink(postStruct)
publishLinkCategory(postStruct)
publishComment(postStruct)
publishCommentCategory(postStruct)

##function/listenners to get posts

getPosts({
  startAt: <int>, 
  count: <int>,
  beforeTimestamp: <int>,
  afterTimestamp: <int>,
  userSubscriptions: <array>,
  addressSubscriptions: <array>
})

post('category').on( (post) => {
  console.log(post)
})

##post structure 

{
	link: "infoHash:hash" or "magnet:blablabla..." or "https://url.com" or "ipfs:hash" // possibly make this optional to save gas
	comment: "ipfs:hash" or "string" // possibly make this optional to save gas
	category: "string" // possibly make this optional to save gas
}

##link ipfs structure

linkIpfs: {
	comment:
	media:
}

##comment ipfs structure

commentIpfs: "string"