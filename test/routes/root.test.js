/* eslint-env jest */

// modules
import React from 'react'
import {shallow, mount, render} from 'enzyme' // eslint-disable-line
import {BrowserRouter, MemoryRouter, Route, Switch} from 'react-router-dom' // eslint-disable-line
import {Provider} from 'react-redux'

// files
import configureStore from '../../src/store'
import App from '../../src/App'

// stubs
// const {restoreStubs, createStubs} = require('../../../../firestore/test/stub')
// const stubs = {}

let wrapper, store

describe('Root header', () => {
  beforeAll(() => {
    // createStubs(stubs)

    store = configureStore({})
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Route path='/:param1?/:param2?/:param3?/' component={App} />
        </MemoryRouter>
      </Provider>
    )
  })

  afterAll(() => {
    // restoreStubs(stubs)
  })

  // testBlockCommons()

  test('has correct tab active', () => {
    expect(wrapper.find('.App').text()).toContain('Awesome App!')
  })
})

/*
describe("Block comments", () => {

  beforeAll( () => {
    store = configureStore({})
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/block/123/comments/']}>
          <Route path='/:param1?/:param2?/:param3?/' component={App} />
        </MemoryRouter>
      </Provider>
    )
  })

  testBlockCommons()

  test('has correct tab active', () => {

    expect( wrapper.find('#main-tabs .active.item').text() ).toEqual('Comments')

  })

})

function testBlockCommons() {

  test('has Block component', () => {

    expect(wrapper.find('Block')).toHaveLength(1)
    expect(wrapper.find('Blocks')).toHaveLength(0)
    expect(wrapper.find('Transaction')).toHaveLength(0)
    expect(wrapper.find('Transactions')).toHaveLength(0)

  })

  test('has commons', () => {

    expect(wrapper.find('CommonNav')).toHaveLength(1)
    expect(wrapper.find('CommonHeader')).toHaveLength(1)
    expect(wrapper.find('CommonFooter')).toHaveLength(1)

  })

  test('has correct block height in overview', () => {

    expect( wrapper.find('#overview-Height').text() ).toEqual('123')

  })

  test('has correct block height in header', () => {

    expect( wrapper.find('.header .sub.header').text() ).toEqual('#123')

  })

  test('has blocks active in menu', () => {

    expect( wrapper.find('.nav__menu .active.item').text() ).toEqual('Blocks')

  })

  test('has correct breadcrumb', () => {

    expect( wrapper.find('.common-header .breadcrumb').text() ).toEqual('Home/Blocks/Block Information')

  })
}
*/
