import {combineReducers} from 'redux'

import app from './containers/App/reducers'
import feed from './containers/Feed/reducers'
import header from './containers/Header/reducers'

const reducers = combineReducers({app, feed, header})

export default reducers
