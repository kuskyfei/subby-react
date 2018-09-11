import { createAction } from 'redux-actions'
import A from './type'

const setFeedToInitialState = createAction(A.SET_FEED_TO_INITIAL_STATE)
const setFeed = createAction(A.SET_FEED)

export default {
  setFeedToInitialState,
  setFeed
}
