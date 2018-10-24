const isValidAddress = (address) => {
  if (typeof address !== 'string') {
    return false
  }

  address = cleanAddress(address)

  if (!isValidHexNumber(address)) {
    return false
  }

  if (!address.match(/^0x/)) {
    return false
  }

  if (address.length !== 42) {
    return false
  }

  return true
}

const isValidUsername = (username) => {
  if (typeof username !== 'string') {
    return false
  }
  if (username.length > 39) {
    return false
  }
  if (username.length < 1) {
    return false
  }
  return true
}

const cleanAddress = (address) => {
  address = String(address)
  address = address.toLowerCase()
  address = address.trim()
  return address
}

const cleanUsername = (username) => {
  username = String(username)
  username = username.trim()
  return username
}

const isValidHexNumber = (string) => {
  const containsNonHexChar = string.match(/[^0-9a-fx]/)
  return !containsNonHexChar
}

const subscriptionsStringToObject = (subscriptionsString) => {
  if (typeof subscriptionsString === 'object') {
    return subscriptionsString
  }
  if (typeof subscriptionsString !== 'string') {
    throw Error(`argument ${subscriptionsString} passed to subscriptionsStringToObject is not a string`)
  }

  const subscriptionsStrings = subscriptionsString.split(/\r?\n/)

  const subscriptionsObject = {}

  for (let subscription of subscriptionsStrings) {
    subscription = subscription.trim()

    let isPendingDeletion = false
    if (subscription.match(/\(pending deletion\)$/)) {
      isPendingDeletion = true
      subscription = subscription.replace(/\(pending deletion\)$/, '')
    }

    if (isValidAddress(subscription)) {
      subscription = cleanAddress(subscription)
    } else if (isValidUsername(subscription)) {
      subscription = cleanUsername(subscription)
    } else {
      continue
    }

    subscriptionsObject[subscription] = {}
    if (isPendingDeletion) {
      subscriptionsObject[subscription].pendingDeletion = true
    }
  }

  return subscriptionsObject
}

const subscriptionsObjectToString = (subscriptionsObject) => {
  if (typeof subscriptionsObject === 'string') {
    return subscriptionsObject
  }
  if (typeof subscriptionsObject !== 'object') {
    throw Error(`argument ${subscriptionsObject} passed to subscriptionsObjectToString is not an object`)
  }

  let subscriptionsString = ''
  for (const subscription in subscriptionsObject) {
    if (subscriptionsObject[subscription].pendingDeletion) {
      subscriptionsString += `${subscription} (pending deletion)\r\n`
    } else {
      subscriptionsString += `${subscription}\r\n`
    }
  }

  return subscriptionsString
}

const getActiveSubscriptionsFromSubscriptions = ({localSubscriptions, ethereumSubscriptions}) => {
  // it's important that ethereumSubscriptions is at the end, because it contains pending deletion statuses
  // whereas the others can overwrite each other as much as they want
  const activeSubscriptions = {...localSubscriptions, ...ethereumSubscriptions}

  for (const key in activeSubscriptions) {
    if (activeSubscriptions[key].pendingDeletion) {
      delete activeSubscriptions[key]
    }
  }

  return activeSubscriptions
}

const downloadTextFile = ({text, fileName}) => {
  const blob = new Blob([text], {type: 'text/plain'})

  const a = document.createElement('a')
  document.body.appendChild(a)
  a.style = 'display: none'
  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(url)
}

const importTextFile = () => {
  return new Promise(resolve => {
    // inputting the file
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.style = 'display: none'
    input.type = 'file'
    input.accept = 'text/plain'

    // reading the file
    input.onchange = ({target} = {}) => {
      const reader = new FileReader()
      reader.onload = function () {
        const text = reader.result
        resolve(text)
      }
      reader.readAsText(target.files[0])
    }

    // fake click
    input.click()
  })
}

export {
  subscriptionsStringToObject,
  subscriptionsObjectToString,
  downloadTextFile,
  getActiveSubscriptionsFromSubscriptions,
  importTextFile
}
