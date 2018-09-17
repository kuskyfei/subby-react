import A from './type'

const initialState = {
  profile: null,
  feed: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case A.SET_FEED:
      return {
        ...state, 
        feed: action.payload
      }

    case A.SET_PROFILE:
      return {
        ...state, 
        profile: action.payload
      }

    default:
      return state
  }
}

export default reducer
