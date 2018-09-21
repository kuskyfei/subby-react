import A from './type'

const initialState = {
  publisherProfile: null,
  feed: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case A.SET_FEED:
      return {
        ...state, 
        feed: action.payload
      }

    case A.SET_PUBLISHER_PROFILE:
      return {
        ...state,
        publisherProfile: action.payload
      }

    default:
      return state
  }
}

export default reducer
