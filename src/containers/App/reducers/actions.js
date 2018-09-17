import { createAction } from 'redux-actions'
import A from './type'

const setAddress = createAction(A.SET_ADDRESS)
const setProfile = createAction(A.SET_PROFILE)
const setSubscriptions = createAction(A.SET_SUBSCRIPTIONS)

export default {
  setAddress,
  setProfile,
  setSubscriptions
}
