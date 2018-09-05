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

    test('logo is in header', () => {
      expect(wrapper.find('#header__logo').text()).toContain('Subby')
    })

    test.only('search bar changes url', () => {

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
    
  })
})

/*
it('cancels changes when user presses esc', done => {
  const wrapper = mount(<EditableText defaultValue="Hello" />);
  const input = wrapper.find('input');

  input.simulate('focus');
  input.simulate('change', { target: { value: 'Changed' } });
  input.simulate('keyDown', {
    which: 27,
    target: {
      blur() {
        // Needed since <EditableText /> calls target.blur()
        input.simulate('blur');
      },
    },
  });
  expect(input.get(0).value).to.equal('Hello');

  done();
});
*/

function testCommons () {

}
