import {combineReducers} from 'redux'

import accounts from './accounts'
import account from './account'
import commons from './commons'

const reducers = combineReducers({accounts, account, commons})

export default reducers
