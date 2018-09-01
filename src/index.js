import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import App from './App'
import configureStore from './store'

const initialState = {}
const store = configureStore(initialState)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route path='/:param1?/:param2?/:param3?/' component={App} />
    </BrowserRouter>
  </Provider>
  , document.getElementById('root')
)
