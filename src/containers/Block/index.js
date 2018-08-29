// react
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter, Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

// actions
import * as blockActions from '../../reducers/block/actions'

// components
import {CommonHeader} from '../../components/commons'
import {Tabs, Overview, Comments} from '../../components/Tabs'

// others
import {propsToFields} from '../../util'

const getDummyBlock = (height) => ({
  height: height,
  timestamp: 1523635475450,
  transactions: '23 transactions and 0 contract internal transactions in this block',
  hash: '0xa28be1e9791bdcfab2628e03a187a92fae4a8c291c1a65a87a20832b8724ac91',
  parent: '0xaa2544cc0f1c8189e2605ab35eba051d51baeef0c91f1dcf47d97357e34d10a1',
  sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
  producer: '0x52e44f279f4203dcf680395379e5f9990a69f13c in 8 secs',
  difficulty: '3,128,480,037,246,766',
  'total difficulty': '3,619,310,141,791,073,934,275',
  size: '3529 bytes',
  'gas used': '586,707 (7.34%)',
  'gas limit': '7,997,055',
  nonce: '0xa9929f00075052f5',
  'block reward': '3.029885469 Ether (3 + 0.029885469)',
  'uncles reward': '0'
})

class Block extends Component {
  componentDidMount () {
    const height = this.props.match.params.height

    const block = getDummyBlock(height)
    const setBlock = this.props.blockActions.setBlock
    setBlock(block)
  }

  render () {
    const block = this.props.block
    const fields = propsToFields(block)
    const height = this.props.match.params.height
    const isComments = this.props.match.params.tab === 'comments'
    const activeTabIndex = paramToTabIndex(this.props.match.params.tab)

    const breadcrumb = [
      { key: 'home', content: <Link to='/'>Home</Link> },
      { key: 'blocks', content: <Link to='/blocks/'>Blocks</Link> },
      { key: 'info', content: 'Block Information', active: true }
    ]

    return (
      <div>

        <CommonHeader type='Block' id={'#' + height} breadcrumb={breadcrumb} />
        <Tabs activeIndex={activeTabIndex}>
          <Overview data={fields} menuItem={<Menu.Item key='Overview' as={Link} to={`/block/${height}/`}>Overview</Menu.Item>} />
          <Comments isComments={isComments} disqusId={`Block ${height}`} menuItem={<Menu.Item key='Comments' as={Link} to={`/block/${height}/comments/`} className='disqus-comment-count' data-disqus-url={window.location.href}>Comments</Menu.Item>} />

        </Tabs>
      </div>
    )
  }
}

const paramToTabIndex = (param) => {
  if (param === 'comments') return 1
  return 0
}

const mapStateToProps = state => ({...state})
const mapDispatchToProps = dispatch => ({
  blockActions: bindActionCreators(blockActions, dispatch)
})

Block = withRouter(connect(mapStateToProps, mapDispatchToProps)(Block)) // eslint-disable-line

export {Block}
