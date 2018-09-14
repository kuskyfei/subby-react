import A from './type'

const initialState = []

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case A.SET_SUBSCRIPTIONS_TO_INITIAL_STATE:
      return [
        ...initialState
      ]

    case A.SET_SUBSCRIPTIONS:
      return [
        ...action.payload
      ]

    default:
      return state
  }
}

export default reducer
