import {combineReducers} from 'redux'

import app from './containers/App/reducers'
import feed from './containers/Feed/reducers'
import profile from './containers/Profile/reducers'

const reducers = combineReducers({app, feed, profile})

export default reducers
