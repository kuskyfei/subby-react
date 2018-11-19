const debug = require('debug')('services:utils')

const cleanBlacklist = (blacklist) => {
	 if (!blacklist) {
  	return {}
  }

  const cleanedBlacklist = {}
  const blacklistArray = Object.keys(blacklist)

  for (let account of blacklistArray) {
    account = account.trim()
    if (account.length > 39) {
      account = account.toLowerCase()
    }
    cleanedBlacklist[account] = {}
  }
  return cleanedBlacklist
}
// blacklist variables are copied from window to prevent 
// the user editing them after the site has loaded
const blacklist = cleanBlacklist(window.SUBBY_BLACKLIST)
const blacklistEnabled = window.SUBBY_GLOBAL_SETTINGS.BLACKLIST
const isBlacklisted = (...accounts) => {
  if (!blacklistEnabled) {
    return false
  }
  if (window.location.protocol === 'file:') {
  	return false
  }
  for (let account of accounts) {
  	if (!account) {
  		break
  	}
    account = account.trim()
    if (account.length > 39) {
      account = account.toLowerCase()
    }
    if (blacklist[account]) {
      return true
    }
    // the blacklist can be base64 encoded if needed
    if (blacklist[window.btoa(account)]) {
    	return true
    }
  }
  return false
}
const removeBlacklisted = (accounts) => {
	debug('removeBlacklisted', accounts)

	if (Array.isArray(accounts)) {
		const originalAccounts = accounts
		accounts = []
		for (const account of originalAccounts) {
			if (isBlacklisted(account)) {
				break
			}
			accounts.push(account)
		}
	} else {
		accounts = {...accounts}
		for (const account in accounts) {
			if (isBlacklisted(account)) {
				delete accounts[account]
			}
		}
	}

	debug('removeBlacklisted end', accounts)
	return accounts
}

// http post variable is copied from window to prevent 
// the user editing it after the site has loaded
const httpPostsEnabled = window.SUBBY_GLOBAL_SETTINGS.HTTP_POSTS
const postsAreEnabled = () => {
	if (window.location.protocol === 'file:') {
  	return true
  }
  if (httpPostsEnabled) {
  	return true
  }
  return false
}

const urlToBlob = async (url) => {
  const res = await fetch(url)
  const blob = await res.blob()
  return blob
}

const blobToString = (blob) => new Promise(resolve => {
  const reader = new FileReader()
  reader.onload = () => {
    resolve(reader.result)
  }
  reader.readAsText(blob)
})

const downloadSubby = async ({username, postId, fileName = 'subby'} = {}) => {
  const subbyHeaderSize = 2000
  const subbyBlob = await urlToBlob('')
  let subbyHeader = await blobToString(subbyBlob.slice(0, subbyHeaderSize))

  if (username) {
    username = escapeSingleQuote(username)
    subbyHeader = subbyHeader.replace(/HOMEPAGE_PROFILE: '.*'/, `HOMEPAGE_PROFILE: '${username}'`)
  }

  if (postId) {
    postId = escapeSingleQuote(postId)
    subbyHeader = subbyHeader.replace(`HOMEPAGE_POST_ID: ''`, `HOMEPAGE_POST_ID: '${postId}'`)
  }

  let newSubbyBlob = subbyBlob
  if (username !== null && username !== undefined) {
    newSubbyBlob = new Blob([subbyHeader, subbyBlob.slice(subbyHeaderSize + 1, subbyBlob.size)])
  }

  downloadBlob({blob: newSubbyBlob, fileName: fileName + '.html'})
}

const downloadBlob = ({blob, fileName}) => {
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.style = 'display: none'
  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(url)
}

const escapeSingleQuote = (string) => {
  string = String(string)
  string = string.replace(/'/g, '%27')
  return string
}

export {urlToBlob, blobToString, downloadSubby, isBlacklisted, removeBlacklisted, postsAreEnabled}
