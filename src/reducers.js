import {combineReducers} from 'redux'
import app from './containers/App/reducers'
import feed from './containers/Feed/reducers'

const reducers = combineReducers({app, feed})

export default reducers
