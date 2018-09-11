import A from './type'

const initialState = {
  address: null,
  profile: null,
  subscriptions: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case A.SET_APP_TO_INITIAL_STATE:
      return {
        ...initialState
      }

    case A.SET_ADDRESS:
      return {
        ...state,
        address: action.payload
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