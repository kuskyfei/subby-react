import {createStore, applyMiddleware, compose} from 'redux'
import reducers from './reducers'

const configureStore = (initialState = {}) => {
  const middlewares = []

  let enhancers
  if (isJest() || process.env.NODE_ENV === 'production') enhancers = [applyMiddleware(...middlewares)]
  else {
    enhancers = [
      applyMiddleware(...middlewares),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    ]
  }

  const store = createStore(reducers, initialState, compose(...enhancers))

  return store
}

const isJest = () => (process.argv[1]) ? process.argv[1].match(/jest/) : undefined

export default configureStore
