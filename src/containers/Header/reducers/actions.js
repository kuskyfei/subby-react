import { createAction } from 'redux-actions'
import A from './type'

const setIsLoading = createAction(A.SET_IS_LOADING)

export default {
  setIsLoading
}
