import { createAction } from 'redux-actions'
import A from './type'

const setAppToInitialState = createAction(A.SET_APP_TO_INITIAL_STATE)
const setEthereumAddress = createAction(A.SET_ETHEREUM_ADDRESS)
const setProfile = createAction(A.SET_PROFILE)
const setSubscriptions = createAction(A.SET_SUBSCRIPTIONS)

export default {
  setAppToInitialState,
  setEthereumAddress,
  setProfile,
  setSubscriptions
}
