import { createAction } from 'redux-actions'
import A from './type'

const setSubscriptionsToInitialState = createAction(A.SET_SUBSCRIPTIONS_TO_INITIAL_STATE)
const setSubscriptions = createAction(A.SET_SUBSCRIPTIONS)

export default {
  setSubscriptionsToInitialState,
  setSubscriptions
}
