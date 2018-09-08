import { createAction } from 'redux-actions'
import A from './type'

const setAppToInitialState = createAction(A.SET_APP_TO_INITIAL_STATE)
const setAddress = createAction(A.SET_ADDRESS)
const setProfile = createAction(A.SET_PROFILE)
const setSubscriptions = createAction(A.SET_SUBSCRIPTIONS)

export default {
  setAppToInitialState,
  setAddress,
  setProfile,
  setSubscriptions
}
