import React, {Component} from 'react'
import {Container, Table, Button} from 'semantic-ui-react'

import {propsToTable, toTitleCase} from '../../util'

const Total = () =>
  <p className='flex-left m-t-10 table__total'>
    Showing Block (#5415991 to #5415967) out of 5416017 total blocks
  </p>

const Pagination = () =>
  <div className='flex-right'>
    <Button compact size='mini'>
      First
    </Button>
    <Button compact size='mini'>
      Prev
    </Button>
    <Button compact size='mini'>
      Page 2 of 210987
    </Button>
    <Button compact size='mini'>
      Next
    </Button>
    <Button compact size='mini'>
      Last
    </Button>
  </div>

class MainTable extends Component {
  render () {
    const headers = this.props.tableHeaders || []
    const rows = propsToTable(this.props.tableData, headers) || []

    const tableHeaders = []

    for (const header of headers) {
      const tableHeader = <Table.HeaderCell className='table__header-row' id={`main-table-header-${header}`} key={header}>{toTitleCase(header)}</Table.HeaderCell>
      tableHeaders.push(tableHeader)
    }

    const tableRows = []

    for (const row of rows) {
      const cells = []

      for (const cell of row) {
        const tableCell = <Table.Cell key={row[0] + cell}>{cell}</Table.Cell>
        cells.push(tableCell)
      }
      const tableRow = <Table.Row key={row[0]}>{cells}</Table.Row>
      tableRows.push(tableRow)
    }

    return (
      <Container>
        <div className='table-flex'>
          <Total />
          <Pagination />
        </div>

        <Table className='table' selectable singleLine>
          <Table.Header>
            <Table.Row>
              {tableHeaders}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {tableRows}
          </Table.Body>
        </Table>
        <div className='flex'>
          <div />
          <Pagination />
        </div>
      </Container>
    )
  }
}

export {MainTable as Table}
