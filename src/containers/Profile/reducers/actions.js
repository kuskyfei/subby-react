import { createAction } from 'redux-actions'
import A from './type'

const setFeed = createAction(A.SET_FEED)
const setProfile = createAction(A.SET_PROFILE)

export default {
  setFeed,
  setProfile
}
