import React from 'react'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

const styles = theme => ({
  margin: {
    marginTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      paddingLeft: 24,
      paddingRight: 24
    },
    overflowWrap: 'break-word'
  },
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
  }
})

let Download = (props) => {
  const {classes, message, download, downloadMessage} = props

  return (
    <Typography className={classes.margin} variant='body2' component='div' gutterBottom>
      {message}&nbsp;
      <a
        className={classes.link}
        onClick={download}>
        {downloadMessage}
      </a>
    </Typography>
  )
}
Download = withStyles(styles)(Download)

class Torrent extends React.Component {
  state = {
    filesOpen: false
  }

  handleClick () {
    this.setState({...this.state, filesOpen: !this.state.filesOpen})
  }

  render () {
    const {classes, torrent} = this.props

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
Torrent = withStyles(styles)(Torrent) // eslint-disable-line

export {Download, Torrent}
