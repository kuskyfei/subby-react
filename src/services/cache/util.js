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
  const formated = []
  for (const key in subscriptions) {
    formated.push(key)
  }
  return formated
}

export {
  mergeSubscriptions,
  mergeSubscriptionsLoggedInSubscriptions,
  filterSubscriptions,
  formatSubscriptions
}
