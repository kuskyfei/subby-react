import A from './type'

const initialState = {
  isLoading: false,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case A.SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }

    default:
      return state
  }
}

export default reducer
