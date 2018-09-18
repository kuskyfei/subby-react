import { createAction } from 'redux-actions'
import A from './type'

const setSubscriptions = createAction(A.SET_SUBSCRIPTIONS)

export default {
  setSubscriptions
}
