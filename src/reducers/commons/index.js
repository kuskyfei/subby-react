
import A from './type'

const initialState = {}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case A.SET_TO_INITIAL_STATE:
      return {
        ...initialState
      }

    case A.SET_LATEST_COMMENTS:
      return {
        ...state, latestComments: action.payload
      }

    default:
      return state
  }
}

export default reducer
