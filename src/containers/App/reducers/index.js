import A from './type'

const initialState = {
  address: null,
  profile: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
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

    default:
      return state
  }
}

export default reducer
