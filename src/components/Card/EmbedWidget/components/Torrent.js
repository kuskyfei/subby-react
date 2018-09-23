import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

const debug = require('debug')('components:Card:EmbedWidget:Torrent')

const styles = theme => ({
  link: {
    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'underline'
    },
    cursor: 'pointer'
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default
    },
    height: 34
  },
  filesRow: {
    height: 200,
    overflow: 'scroll'
  },
  nameCell: {
    width: '30%'
  },
  table: {
    animation: 'fadeIn ease 1.5s'
  }
})

class Torrent extends React.Component {
  state = {
    filesOpen: false
  }

  handleClick () {
    this.setState({...this.state, filesOpen: !this.state.filesOpen})
  }

  componentDidMount () {
    debug('mounted')
  }

  componentDidUpdate (prevProps) {
    debug('updated')
  }

  componentWillUnmount () {
    debug('unmounted')
  }

  render () {
    const {classes, url: torrent} = this.props

    debug('torrent', torrent)

    const files = []

    for (const file of torrent.files) {
      files.push(<p>{file}</p>)
    }
  
    return (
      <Table className={classes.table}>
        <TableBody>
          <TableRow className={classes.row}>
            <TableCell className={classes.nameCell} >
              Name
            </TableCell>
            <TableCell>
              {torrent.name}
            </TableCell>
          </TableRow>

          <TableRow className={classes.row}>
            <TableCell className={classes.nameCell} >
              Size
            </TableCell>
            <TableCell>
              {torrent.sizeInMbs} MB
            </TableCell>
          </TableRow>

          <TableRow className={classes.row}>
            <TableCell className={classes.nameCell} >
              Magnet
            </TableCell>
            <TableCell>
              <a className={classes.link} href={torrent.magnet}>
                  Magnet Link
              </a>
            </TableCell>
          </TableRow>

          <TableRow className={classes.row}>
            <TableCell className={classes.nameCell} >
              Peers
            </TableCell>
            <TableCell>
              {torrent.peerCount}
            </TableCell>
          </TableRow>

          <TableRow className={classes.row}>
            <TableCell className={classes.nameCell} >
              Files
            </TableCell>
            <TableCell>
              {torrent.files.length}&nbsp;
              <a onClick={this.handleClick.bind(this)}>
                {(this.state.filesOpen) ? '[ - ]' : '[ + ]'}
              </a>

            </TableCell>
          </TableRow>

          {this.state.filesOpen &&
            <TableRow className={classes.row}>
              <TableCell className={classes.nameCell} />
              <TableCell>
                <div className={classes.filesRow}>
                  {files}
                </div>
              </TableCell>
            </TableRow>
          }

        </TableBody>
      </Table>
    )
  }
}

export default withStyles(styles)(Torrent) // eslint-disable-line
