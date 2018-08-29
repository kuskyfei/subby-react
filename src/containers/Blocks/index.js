// modules
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter, Link } from 'react-router-dom'

// actions
import * as blocksActions from '../../reducers/blocks/actions'

// components
import {Table} from '../../components/Table'
import {CommonHeader} from '../../components/commons'

const getDummyBlocks = () => [
  {height: '5414795', age: '54 secs ago', txn: '38', uncles: '0', miner: 'Ethermine', gasUsed: '1795541 (22.44%)', gasLimit: '11.44 Gwei', avgGasPrice: '3.02054 Ether'},
  {height: '5414794', age: '58 secs ago', txn: '121', uncles: '0', miner: 'Nanopool', gasUsed: '5669630 (70.94%)', gasLimit: '11.41 Gwei', avgGasPrice: '3.0647 Ether'},
  {height: '5414793', age: '1 min ago', txn: '190', uncles: '0', miner: 'f2pool_2', gasUsed: '7982670 (99.98%)', gasLimit: '3.84 Gwei', avgGasPrice: '3.03067 Ether'},
  {height: '5414792', age: '1 min ago', txn: '64', uncles: '0', miner: 'SparkPool', gasUsed: '2008200 (25.18%)', gasLimit: '16.21 Gwei', avgGasPrice: '3.03256 Ether'},
  {height: '5414791', age: '1 min ago', txn: '149', uncles: '0', miner: 'DwarfPool1', gasUsed: '7949137 (99.56%)', gasLimit: '9.85 Gwei', avgGasPrice: '3.07832 Ether'},
  {height: '5414790', age: '1 min ago', txn: '234', uncles: '0', miner: 'f2pool_2', gasUsed: '7985018 (99.91%)', gasLimit: '4.67 Gwei', avgGasPrice: '3.0373 Ether'},
  {height: '5414789', age: '1 min ago', txn: '147', uncles: '2', miner: 'DwarfPool1', gasUsed: '7940902 (99.45%)', gasLimit: '13.25 Gwei', avgGasPrice: '3.29268 Ether'},
  {height: '5414788', age: '2 mins ago', txn: '164', uncles: '0', miner: 'miningp', gasUsed: '7987439 (99.94%)', gasLimit: '3.34 Gwei', avgGasPrice: '3.02667 Ether'},
  {height: '5414787', age: '2 mins ago', txn: '154', uncles: '0', miner: '0xcc16e3c0', gasUsed: '7969822 (99.82%)', gasLimit: '13.67 Gwei', avgGasPrice: '3.10895 Ether'},
  {height: '5414786', age: '3 mins ago', txn: '185', uncles: '0', miner: 'SparkPool', gasUsed: '7991006 (99.98%)', gasLimit: '14.08 Gwei', avgGasPrice: '3.1125 Ether'},
  {height: '5414785', age: '3 mins ago', txn: '147', uncles: '0', miner: 'Ethermine', gasUsed: '6900670 (86.26%)', gasLimit: '19.82 Gwei', avgGasPrice: '3.13678 Ether'},
  {height: '5414784', age: '4 mins ago', txn: '92', uncles: '0', miner: 'miningpool', gasUsed: '7992022 (99.90%)', gasLimit: '5.69 Gwei', avgGasPrice: '3.0455 Ether'},
  {height: '5414783', age: '4 mins ago', txn: '58', uncles: '1', miner: 'Nanopool', gasUsed: '3259697 (40.75%)', gasLimit: '6.78 Gwei', avgGasPrice: '3.11586 Ether'},
  {height: '5414782', age: '4 mins ago', txn: '8', uncles: '0', miner: 'Coinotron_2', gasUsed: '231958 (2.90%)', gasLimit: '60.94 Gwei', avgGasPrice: '3.01413 Ether'},
  {height: '5414781', age: '4 mins ago', txn: '184', uncles: '0', miner: '0xcc16e3', gasUsed: '7265738 (90.91%)', gasLimit: '10.06 Gwei', avgGasPrice: '3.07307 Ether'},
  {height: '5414780', age: '5 mins ago', txn: '14', uncles: '0', miner: 'Ethermine', gasUsed: '944732 (11.81%)', gasLimit: '14.31 Gwei', avgGasPrice: '3.01351 Ether'},
  {height: '5414779', age: '5 mins ago', txn: '157', uncles: '0', miner: 'f2pool_2', gasUsed: '7998715 (99.97%)', gasLimit: '9.25 Gwei', avgGasPrice: '3.07398 Ether'},
  {height: '5414778', age: '5 mins ago', txn: '149', uncles: '0', miner: 'Nanopool', gasUsed: '5947974 (74.35%)', gasLimit: '16.97 Gwei', avgGasPrice: '3.10095 Ether'},
  {height: '5414777', age: '5 mins ago', txn: '113', uncles: '0', miner: 'f2pool_2', gasUsed: '7989489 (99.82%)', gasLimit: '7.50 Gwei', avgGasPrice: '3.05992 Ether'},
  {height: '5414776', age: '6 mins ago', txn: '157', uncles: '0', miner: 'miningpo', gasUsed: '7993562 (99.92%)', gasLimit: '2.01 Gwei', avgGasPrice: '3.01606 Ether'},
  {height: '5414775', age: '6 mins ago', txn: '32', uncles: '0', miner: 'bitclubpool', gasUsed: '1133308 (14.18%)', gasLimit: '36.51 Gwei', avgGasPrice: '3.04137 Ether'},
  {height: '5414774', age: '6 mins ago', txn: '52', uncles: '1', miner: 'miningpo', gasUsed: '7981344 (99.77%)', gasLimit: '1.66 Gwei', avgGasPrice: '3.10703 Ether'},
  {height: '5414773', age: '6 mins ago', txn: '86', uncles: '0', miner: 'DwarfPool1', gasUsed: '7984755 (99.79%)', gasLimit: '3.09 Gwei', avgGasPrice: '3.02467 Ether'},
  {height: '5414772', age: '6 mins ago', txn: '126', uncles: '0', miner: 'Ethermine', gasUsed: '6510457 (81.38%)', gasLimit: '11.58 Gwei', avgGasPrice: '3.07539 Ether'},
  {height: '5414771', age: '6 mins ago', txn: '125', uncles: '0', miner: 'DwarfPool1', gasUsed: '6755158 (84.52%)', gasLimit: '13.70 Gwei', avgGasPrice: '3.09255 Ether'}
]

class Blocks extends Component {
  componentDidMount () {
    const blocks = getDummyBlocks()
    const setBlocks = this.props.blocksActions.setBlocks
    setBlocks(blocks)
  }

  render () {
    const blocks = this.props.blocks

    const tableHeaders = ['height', 'age', 'txn', 'uncles', 'miner', 'gasUsed', 'gasLimit', 'avgGasPrice']

    const breadcrumb = [
      { key: 'home', content: <Link to='/'>Home</Link> },
      { key: 'blocks', content: 'Blocks', active: true }
    ]

    return (
      <div>
        <CommonHeader type='Blocks' breadcrumb={breadcrumb} />
        <Table tableData={blocks} tableHeaders={tableHeaders} />
      </div>
    )
  }
}

const mapStateToProps = state => ({...state})
const mapDispatchToProps = dispatch => ({
  blocksActions: bindActionCreators(blocksActions, dispatch)
})

Blocks = withRouter(connect(mapStateToProps, mapDispatchToProps)(Blocks)) // eslint-disable-line

export {Blocks}
