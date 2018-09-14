import A from './type'

const initialState = []

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case A.SET_SETTINGS_TO_INITIAL_STATE:
      return [
        ...initialState
      ]

    case A.SET_SETTINGS:
      return [
        ...action.payload
      ]

    default:
      return state
  }
}

export default reducer
