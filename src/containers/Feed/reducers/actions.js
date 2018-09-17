import { createAction } from 'redux-actions'
import A from './type'

const setFeed = createAction(A.SET_FEED)

export default {
  setFeed
}
