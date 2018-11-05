/* database schema

  - profiles // object store
    - usernameOrAddress
      - username
      - thumbnail
      - bio
      - subscriberCount
      - subscribtionCount
      - tipCount
      - lastProfileCacheTimestamp
    - usernameOrAddress2
    - etc...
  - feed // object store
    - posts
      - post1
      - post2
      - etc...
    - hasMorePosts
    - lastFeedCacheCursor
    - lastFeedCacheTimestamp
  - loggedInSubscriptions // object store
    - usernameOrAddress
      - subscriptions
        - subscription1
        - subscription2
        - etc...
      - lastEthereumSubscriptionsCacheTimestamp
  - loggedOutSubscriptions // object store
    - subscription1
    - subscription2
    - etc....
  - settings // object store

*/

const idb = require('idb')
window.SUBBY_DEBUG_GET_IDB = idb

const db = require('./db')

// init cannot be a constant or otherwise it can't
// be mocked properly
let init = async ({version}) => {
  db.db = await idb.open('subby', version, upgradeDb => {
    if (!upgradeDb.objectStoreNames.contains('profiles')) {
      upgradeDb.createObjectStore('profiles')
    }
    if (!upgradeDb.objectStoreNames.contains('activeFeed')) {
      upgradeDb.createObjectStore('activeFeed')
    }
    if (!upgradeDb.objectStoreNames.contains('backgroundFeed')) {
      upgradeDb.createObjectStore('backgroundFeed')
    }
    if (!upgradeDb.objectStoreNames.contains('localSubscriptions')) {
      upgradeDb.createObjectStore('localSubscriptions')
    }
    if (!upgradeDb.objectStoreNames.contains('settings')) {
      upgradeDb.createObjectStore('settings')
    }
  })
}

// if you delete the db you need to make sure the site 
// is closed in all tabs or it will no longer
// open until you close all tabs
const deleteEverything = () => new Promise(async resolve => {
  await db.db.close()

  const req = window.indexedDB.deleteDatabase('subby')
  req.onsuccess = () => {
    resolve()
  }
  req.onerror = () => {
    console.error("Couldn't delete database")
  }
  req.onblocked = () => {
    console.error("Couldn't delete database due to the operation being blocked")
  }
})
window.SUBBY_DEBUG_DELETE_INDEXEDDB = deleteEverything

export {init}
