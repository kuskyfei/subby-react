// react
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

// components
import {CommonHeader} from '../../components/commons'
import {Tabs} from '../../components/Tabs'
import {Verify} from '../../components/Verify'

class Pages extends Component {
  render () {
    const path = this.props.location.pathname
    const {tabs, pageName} = getPage(path)

    const breadcrumb = [
      { key: 'home', content: <Link to='/'>Home</Link> },
      { key: 'verify', content: pageName, active: true }
    ]

    return (
      <div>

        <CommonHeader type='Verify Contract Code' breadcrumb={breadcrumb} />
        <Tabs>
          {tabs}
        </Tabs>
      </div>
    )
  }
}

const getPage = (path) => {
  if (path.match(/^\/verify/)) {
    const pageName = 'Verify Contract Code'

    const tabs = [
      <Verify key='verify' menuItem={<Menu.Item key='verify'>Contract Source Code</Menu.Item>} />
    ]

    return {tabs, pageName}
  }
}

const mapStateToProps = state => ({...state})
const mapDispatchToProps = dispatch => ({ })

Pages = withRouter(connect(mapStateToProps, mapDispatchToProps)(Pages)) // eslint-disable-line

export {Pages}
