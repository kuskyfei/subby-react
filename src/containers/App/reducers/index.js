import A from './type'

const initialState = {
  ethereumAddress: null,
  profile: null,
  subscriptions: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case A.SET_APP_TO_INITIAL_STATE:
      return {
        ...initialState
      }

    case A.SET_ETHEREUM_ADDRESS:
      return {
        ...state,
        ethereumAddress: action.payload
      }

    case A.SET_PROFILE:
      return {
        ...state,
        profile: action.payload
      }

    case A.SET_SUBSCRIPTIONS:
      return {
        ...state,
        subscriptions: action.payload
      }

    default:
      return state
  }
}

export default reducer
