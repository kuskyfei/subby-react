import { createAction } from 'redux-actions'
import A from './type'

// actions
export const setAccountToInitialState = createAction(A.SET_ACCOUNT_TO_INITIAL_STATE)
export const setAccount = createAction(A.SET_ACCOUNT)
