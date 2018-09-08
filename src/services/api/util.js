const mergeSubscriptionsLoggedInSubscriptions = ({ethereumSubscriptions = {}, loggedInSubscriptions = {}}) => {
  for (const key in ethereumSubscriptions) {
    if (!loggedInSubscriptions[key]) {
      loggedInSubscriptions[key] = ethereumSubscriptions[key]
    }
  }

  return loggedInSubscriptions
}

const mergeSubscriptions = ({loggedInSubscriptions = {}, loggedOutSubscriptions = {}}) => {
  for (const key in loggedOutSubscriptions) {
    if (!loggedInSubscriptions[key]) {
      loggedInSubscriptions[key] = loggedOutSubscriptions[key]
    }
  }

  return loggedInSubscriptions
}

const filterSubscriptions = (subscriptions) => {
  const filtered = {}
  for (const key in subscriptions) {
    if (!subscriptions[key].muted) filtered[key] = subscriptions[key]
  }

  return filtered
}

const formatSubscriptions = (subscriptions) => {
  const formated = {
    userSubscriptions: [],
    addressSubscriptions: []
  }
  for (const key in subscriptions) {
    if (key.length === 42) {
      formated.addressSubscriptions.push(key)
    } else {
      formated.userSubscriptions.push(key)
    }
  }
  return formated
}

export {
  mergeSubscriptions,
  mergeSubscriptionsLoggedInSubscriptions,
  filterSubscriptions,
  formatSubscriptions
}
