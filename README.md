## How to debug

Subby has a few global variables attached to the window object:

1. SUBBY_GLOBAL_SETTINGS
// tells you the public global variables

2. SUBBY_DEBUG_INDEXEDDB()
// tells you the entire content of indexedDb variable

Subby uses the debug npm module to log information to the console. To use it, type one of these options in the Chrome console:

```
localStorage.debug = 'indexedDb:*'
localStorage.debug = 'indexedDb:read'
localStorage.debug = 'indexedDb:write'
localStorage.debug = 'containers:*'
localStorage.debug = 'containers:App'
localStorage.debug = 'containers:Feed'
```

##todo

changing metamask accounts breaks publish button
make the post dialog go away after we click publish in metamask?
profile not connected message
fix metamask on compiled version
fix ga
update cache functions
fix subby.js onNetworkChange and onAddressChange 
add 'username is taken' error validation
add a "your metamask is locked page"
make find accounts to follow post
make publishing content guide

##todo after release
add pagination after 200 posts
add react-helmet for SEO and social media shares
set up analytics events
add IPFS and torrents streaming
add warning to use chrome
fix end of feed behavior
add blacklist
add donation event mesages popup
make compile js file version
new version available pop up
detect errors with embeds (using height of elements possibly?) / fix bug with twitter and IG cards
fix line bug in preview with iframes
"you don't have any donation message"
make the index.html scripts optional
add pop up on new posts found during update cache
fix timestamps in subby.js and revert in front end
rename minimumDonation to minimumTextDonation in subby.js
remove toWei function from lib and make it for read only functions

## todo puppeteer tests

- homepage gets help and sets address, profile and subscriptions
- publish post of each type
- header navigation loads proper pages
- search bar loads proper page
- feed works
- publisher feed works
- permalink feed works
- my profile feed works
- scrolling each feed till 1000 posts
- test subscribe / unsubscribe

## todo jest tests



##todo long term

add support for streaming IPFS videos (need to include codec with hash)
add support for streaming torrent files (need to include codec with magnet)
make sitemap generator
make indexer / search engine
add transalations (put all english into a JSON file and use the file to translate)
add interface for ledger nano
add text to speech donations

##env versions
tested on node v10.9.0 and npm v6.2.0

##Supported content:

-Youtube embeds
-Vimeo embeds
-Reddit embeds
-Twitter embeds
-Facebook embeds
-Instagram embeds
-IPFS
-Torrents
-Direct links to jpg, jpeg, png, gif, webm, mp4, ogg, wav, mp3, flac

##supported p2p protocols

bittorrent
ipfs

##read functions

getProfileFromUsername(username)
getProfileFromAddress(address)

returns (username, thumbail, bio, subscriberCount, subscribtionCount, tipCount)

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

##url structure

p=page (example: feed, about, profile, settings, etc. Not the page number)
u=username
a=address
id=id
startAt=start at what number in request (used for pagination of feeds)
count=how many posts in request (used for pagination of feeds)
before=beforeTimstamp (used for pagination of feeds)
after=afterTimestamp (used for pagination of feeds)

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

linkIpfs: "string" // point to the media file directly

##comment ipfs structure

commentIpfs: "string" // point to the string directly

ideas for new methods

tip(username, address, amount, message) // use address if username is undefined
// the owner should have a function to enable tip and price per byte

terminateAccount() // if your account gets hacked you can terminate it so your followers don't get spammed. Terminated accounts don't show in any feeds.

setDonationPricePerCharacter(int)
getDonationPricePerCharacter(username, address)

new subscriptions methods:

getSubscriptions(username, address) returns (categories<array>, subscriptions<arrayOfArraysOfArrays>)

example of return: 

[ 
  [music, youtubers, gaming], 
  [  
    [ [musicUser1, musicUser2, musicUser3], [musicAddress1, musicAddress2, musicAddress3] ],
    [ [youtubeUser1, youtubeUser2, youtubeUser3], [youtubeAddress1, youtubeAddress2, youtubeAddress3] ],
    [ [gamingUser1, gamingUser2, gamingUser3], [gamingAddress1, gamingAddress2, gamingAddress3] ]
  ]
]

subscribe(username, address, category='default')

// when you subscribe, it stores the subscriptions into an array of array like

[  
  [ [musicUser1, musicUser2, musicUser3], [musicAddress1, musicAddress2, musicAddress3] ],
  [ [youtubeUser1, youtubeUser2, youtubeUser3], [youtubeAddress1, youtubeAddress2, youtubeAddress3] ],
  [ [gamingUser1, gamingUser2, gamingUser3], [gamingAddress1, gamingAddress2, gamingAddress3] ]
]

// and it stores the category into an array that matches the index of the array above

[
  music, 
  youtubers, 
  gaming
]

// if the category doesn't exist, it creates it.

Other possibility:

getSubscriptions(username, address) return [ [name, address, category], [name, address, category], [name, address, category], [name, address, category] ]


#object stores in Idb

- profiles // object store
  - usernameOrAddress
    - username
    - thumbnail
    - bio
    - subscriberCount
    - subscribtionCount
    - tipCount
    - lastProfileCacheTimeStamp
  - usernameOrAddress2
  - etc...
- feed // object store
  - posts
    - post1
    - post2
    - etc...
  - hasMorePostsOnEthereum
  - lastFeedCacheCursor
- loggedInSubscriptions // object store
  - usernameOrAddress
    - subscriptions
      - subscription1
      - subscription2
      - etc...
    - lastLoggedInSubscriptionsCacheTimeStamp
- loggedOutSubscriptions // object store
  - subscription1
  - subscription2
  - etc....
- settings // object store



#redux stuff

views
  feed
  profile
  subscriptions
  settings
  help
  permalink
  
state

- app.feed
- app.address
- app.subscriptions
- app.settings

- profile.feed
- profile.address
- profile.profile

- containers
  - app
    - app.address
    - app.profile
  - feed
    - app.feed
    - app.address
    - app.subscriptions
  - profile
    - profile.feed
    - profile.address
    - profile.profile
  - subscriptions
    - app.subscriptions
  - settings
    - app.settings
  - help
  - permalink
    - profile.feed
    - profile.profile
  
components
  feed
  post
  header
  profile

  new state

- user.profile
- user.address
- user.subscriptions
- user.settings

- view.feed
- view.profile
- view.address


