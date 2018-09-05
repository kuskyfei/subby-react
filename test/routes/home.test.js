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

describe('routes: home', () => {
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

  describe('header', () => {

    test('logo link change url on click', () => {
      const Logo = wrapper.find('#header__logo Link')

      Logo.simulate('click', { button: 0 })
      expect(getUrlQueries()).toEqual('?p=feed')
    })

    test('search bar changes url on search', () => {

      const searchTerm = 'my-search-term'

      const SearchBarInput = wrapper
        .find('#header__search-bar')
        .filter('input')

      // simulate change event and silences console warning
      const restoreConsole = console.error
      console.error = jest.fn()
      SearchBarInput.simulate('change', {target: {value: searchTerm}})

      // restore console warning
      expect(console.error.mock.calls.length).toBe(1)
      console.error = restoreConsole

      const Header = wrapper
        .find('Header')
      expect(Header.props().location.search).toEqual(`?u=${searchTerm}`)
    })

    test('profile icon menu links change url on click', () => {

      // profile link
      let ProfileIconMenu = getProfileIconMenu()
      ProfileIconMenu.at(0).simulate('click', { button: 0 })
      expect(getUrlQueries()).toEqual('?p=profile')

      // subscriptions link
      ProfileIconMenu = getProfileIconMenu()
      ProfileIconMenu.at(1).simulate('click', { button: 0 })
      expect(getUrlQueries()).toEqual('?p=subscriptions')

      // settings link
      ProfileIconMenu = getProfileIconMenu()
      ProfileIconMenu.at(2).simulate('click', { button: 0 })
      expect(getUrlQueries()).toEqual('?p=settings')

    })

  })
})

const clickOnProfileIcon = () => {
  const ProfileIcon = wrapper
    .find('#header__profile-icon')
    .filter('button')
  ProfileIcon.simulate('click', { button: 0 })  
}

const getProfileIconMenu = () => {
  clickOnProfileIcon()
  const ProfileIconMenu = wrapper
    .find('#header__profile-icon__menu MenuItem')
  return ProfileIconMenu
}

const getUrlQueries = () => {
  const Header = wrapper
    .find('Header')
  return Header.props().location.search
}

function testCommons () {

}
