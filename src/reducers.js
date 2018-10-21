import {combineReducers} from 'redux'

import app from './containers/App/reducers'
import feed from './containers/Feed/reducers'
import header from './containers/Header/reducers'
import subscriptions from './containers/Subscriptions/reducers'

const reducers = combineReducers({app, feed, header, subscriptions})

export default reducers
