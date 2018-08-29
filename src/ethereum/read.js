const getProfileFromUsername = async (username) => {

}

const getProfileFromAddress = async (address) => {
  // return {username, thumbail, bio, subscriberCount, subscribtionCount}
}

const getSubscriptionsFromAddress = async (address) => {

}

const getSubscriptionsFromUsername = async (username) => {

}

const getPosts = async ({startAt, count, beforeTimestamp, afterTimestamp, userSubscriptions, addressSubscriptions}) => {

  // return [...posts]
}

const post = (category) => ({
  on: (cb) => {

    // contract.events.filter(category).on('event', (event) => {
    //   cb(event)

    // })

  }
})

export {getProfileFromUsername, getProfileFromAddress, getSubscriptionsFromAddress, getSubscriptionsFromUsername, getPosts, post}
