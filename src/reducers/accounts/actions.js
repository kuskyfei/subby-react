import { createAction } from 'redux-actions'
import A from './type'

// actions
export const setAccountsToInitialState = createAction(A.SET_ACCOUNTS_TO_INITIAL_STATE)
export const setAccounts = createAction(A.SET_ACCOUNTS)
