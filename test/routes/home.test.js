/* eslint-env jest */

// modules
import React from 'react'
import {shallow, mount, render} from 'enzyme' // eslint-disable-line
import {BrowserRouter, MemoryRouter, Route, Switch} from 'react-router-dom'  // eslint-disable-line
import {Provider} from 'react-redux'

// files
import configureStore from '../../src/store'
import App from '../../src/App'

// material
import {createShallow, createMount} from '@material-ui/core/test-utils' // eslint-disable-line

let wrapper, store

describe('Routes: Home', () => {
  // let mount

  beforeAll(() => {
    // mount = createMount()

    store = configureStore({})
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Route component={App} />
        </MemoryRouter>
      </Provider>
    )
  })

  afterAll(() => {
  })

  testCommons()

  test('Logo is in header', () => {
    expect(wrapper.find('.header__logo').text()).toContain('Subby')

    // console.log(wrapper.html())
  })
})

function testCommons () {

}
