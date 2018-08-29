import { createAction } from 'redux-actions'
import A from './type'

// actions
export const setToInitialState = createAction(A.SET_TO_INITIAL_STATE)
export const setLatestComments = createAction(A.SET_LATEST_COMMENTS)
