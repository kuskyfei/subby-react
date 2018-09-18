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


make publish pop up
make card option pop up
make edit pop up

idb in browser
idb in jest
torrent card
video card
audio card
ipfs card


- make ipfs card
- make card buttons
- make publish pop up
- make profile edit page 
- make drag and drop torrent upload

- fix user profile cache and reducers
- setFeedCache needs to b updated when final get Post design is decided
- get indexdb working in browser
- get indexDb working in jest

- move ipfs download to web worker
- fix username and postid of file download
- add image / letter to header avatar
- add use default settings to settings
- fix the slow typing for user search
- add mute / unsub option to posts
- add warning to use chrome
- add translations
- react-helmet for SEO and social media shares
- optimize queuing for ethereum requests
- make profile page
- set up optional embeds
- set up analytics events
- add torrent card
- add video and audio card (direct link to file)
- do redux stuff
- make edit profile page (some kind of hover if you own the profile)
- make subscribtions page
- make settings page
- add tests for navigation and footer
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

long term todos:

creates indexer
make ledger nano interface

##code for db

## username rules
min 3 characters
maximum 39 characters
cannot start or end with 1 or more spaces or tabs
unicode (utf-8) to accept asian characters and stuff

##versions
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



