import { createAction } from 'redux-actions'
import A from './type'

const setFeed = createAction(A.SET_FEED)
const setPublisherProfile = createAction(A.SET_PUBLISHER_PROFILE)

export default {
  setFeed,
  setPublisherProfile
}
