## Subby
[Javascript API](https://github.com/subby-dapp/subby.js) | [Smart Contracts](https://github.com/subby-dapp/subby-smart-contracts) | [Live Demo](https://subby.io)

## What is Subby
Subby is a decentralized, open source and non-tokenized application that protects content creators against censorship.

## Technology used
Subby is completely decentralized, it communicates directly with Ethereum and IPFS. It is compiled to a standalone subby.html file that can be run from a user's computer, and is not dependent on any single API or server. Is is impossible to censor.

## Monetization
Subby does not include any monetization scheme or token to enrich the developers. It uses Ether.

## Supported content
- Youtube embeds
- Vimeo embeds
- Reddit embeds
- Twitter embeds (not working)
- Facebook embeds
- Instagram embeds (not working)
- IPFS
- Torrents
- Web torrents
- Direct links to jpg, jpeg, png, gif, webm, mp4, ogg, wav, mp3, flac

## Download
https://subby.io/download or use it hosted on GitHub at https://subby.io

## How to compile
```
git clone https://github.com/subby-dapp/subby-react.git && cd subby-react
npm install
npm run build
```
The compiled build can be found in /build

## How to debug

Subby has a few global variables attached to the window object that start with SUBBY_ or SUBBYJS_

Subby uses the debug npm module to log information to the console. To use it, type one of these options in the Chrome console:
```
localStorage.debug = 'indexedDb:*'
localStorage.debug = 'indexedDb:read'
localStorage.debug = 'indexedDb:write'
localStorage.debug = 'containers:*'
localStorage.debug = 'containers:App'
localStorage.debug = 'containers:Feed'
etc
```

## Recommended environment
node v10.9.0 and npm v6.2.0

## URL structure
- p=page (example: feed, about, profile, settings, etc. Not the page number)
- u=username
- id=postId

## Post structure 
```
{
  link: "infoHash:hash" or "magnet:blablabla..." or "https://url.com" or "ipfs:hash"
  comment: "ipfs:hash" or "string"
}
```

## React / Run in dev mode
Subby-React is an un-ejected create-react-app application.
```
git clone https://github.com/subby-dapp/subby-react.git && cd subby-react
npm install
npm start
```

## Tests
Subby-React uses Jest and Puppeteer for automated tests
```
git clone https://github.com/subby-dapp/subby-react.git && cd subby-react
npm install
npm test
```

## IndexedDb object stores

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
- activeFeed // object store
  - posts
    - post1
    - post2
    - etc...
  - hasMorePostsOnEthereum
  - lastFeedCacheCursor
- backgroundFeed // object store
  - posts
    - post1
    - post2
    - etc...
  - hasMorePostsOnEthereum
  - lastFeedCacheCursor
- localSubscriptions // object store
  - usernameOrAddress
    - subscriptions
      - subscription1
      - subscription2
      - etc...
- settings // object store
  - settings

## Redux store
```
{
  app: {
    address: null,
    profile: null
  },
  feed: {
    publisherProfile: null,
    feed: []
  },
  header: {
    isLoading: false
  },
  subscriptions: {}
}
```