import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import classnames from 'classnames'
import IconButton from '@material-ui/core/IconButton'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import CircularProgress from '@material-ui/core/CircularProgress'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'

const prettierBytes = require('prettier-bytes')
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
    height: 34,
  },
  filesRow: {
    maxHeight: 200,
    overflow: 'scroll',
    wordBreak: 'break-all'
  },
  nameCell: {
    width: '30%'
  },
  table: {
    animation: 'fadeIn ease 1.5s',
  },
  nameValueCell: {
    wordBreak: 'break-all',
    paddingTop: 9,
    paddingBottom: 9,
  },
  tableBottom: {
    transform: 'translateY(-3px)',
    borderTopWidth: 1, 
    borderTopColor: '#e0e0e0', 
    borderTopStyle: 'solid'
  },
  torrent: {
    '& video': {
      width: '100%'
    },
    overflow: 'scroll'
  },
  torrentMedia: {
    width: '100%'
  },
  torrentMediaWrapper: {
    position: 'relative'
  },
  playButton: {
    height: 'unset',
    width: 'unset'
  },
  playButtonInvisible: {
    opacity: 0,
    pointerEvents: 'none'
  },
  displayNone: {
    display: 'none'
  },
  linearColorPrimary: {
    backgroundColor: '#e1e1e1',
  },
  linearBarColorPrimary: {
    backgroundColor: '#5d5d5d',
  },
  statusWrapper: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  helpTextWrapper: {
    whiteSpace: 'nowrap',
  },
  statusItem: {
    whiteSpace: 'nowrap',
  }
})

class Torrent extends React.Component {
  constructor(props) {
    super(props)
    this.videoRef = React.createRef()
  }

  state = {
    filesOpen: true,
    showVideo: false,
    showLoading: true,
    status: {}
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

  addTorrentMedia = async (fileIndex) => {
    const {classes, url: torrent} = this.props

    this.setState({showVideo: true, showLoading: true, activeTorrentFileIndex: fileIndex})
    torrent.addToElement(`.${classes.torrentMedia}`, fileIndex)
    this.handleTorrentElementRendered()
    this.handleStatusInterval()
  }

  handleStatusInterval = () => {
    let {url: torrent} = this.props
    torrent = torrent.torrent

    if (this.statusInterval && this.statusInterval.clearInterval) {
      this.statusInterval.clearInterval()
    }

    this.statusInterval = setInterval(() => {
      if (!torrent) {
        return
      }

      let progress = torrent.progress
      if (torrent.done) {
        progress = 1
      }
      progress = (100 * progress).toFixed(1) + '%'

      let remaining
      if (torrent.done) {
        remaining = '0s'
      } else {
        remaining = msToTime(torrent.timeRemaining)
      }

      this.setState({
        status: {
          peers: torrent._peersLength,
          progress,
          remaining,
          downloadSpeed: prettierBytes(torrent.client.downloadSpeed) + '/s ',
          uploadSpeed: prettierBytes(torrent.client.uploadSpeed) + '/s '
        }
      })
    }, 1000)
  }

  handleTorrentElementRendered = () => {
    const {classes} = this.props

    // first listen to the wrapper being changed
    const videoObserver = new MutationObserver(([mutation]) => {
      console.log(mutation)
      videoObserver.disconnect()

      this.setState({showLoading: false})
    })

    // start listening
    const nodeToObserve = this.videoRef.current
    videoObserver.observe(nodeToObserve, {attributes: true})
  }

  render () {
    const {classes, url: torrent} = this.props
    const {showVideo, showLoading, status} = this.state

    debug('torrent', torrent)

    const files = []

    let counter = 0
    for (const file of torrent.files) {
      // if file is not a media, send invisible button
      const invisiblePlayButton = <IconButton className={classnames(classes.playButton, classes.playButtonInvisible)}><PlayArrowIcon /></IconButton>
      let playButton = invisiblePlayButton

      // send real play buttons for playable files
      const fileIndex = counter
      if (torrent.mediaIndexes.includes(fileIndex)) {
        const handlePlay = () => this.addTorrentMedia(fileIndex)
        playButton = <IconButton onClick={handlePlay} className={classes.playButton}><PlayArrowIcon /></IconButton>
      }

      files.push(<p key={file}>{file} {playButton}</p>)
      counter++
    }

    return (
      <div className={classes.torrent}>
        <Table className={classes.table}>
          <TableBody>
            <TableRow className={classes.row}>
              <TableCell className={classes.nameCell} >
                Name
              </TableCell>
              <TableCell className={classes.nameValueCell} >
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
                {torrent.torrent._peersLength || torrent.peerCount}
              </TableCell>
            </TableRow>

            <TableRow className={classes.row}>
              <TableCell className={classes.nameCell} >
                Files
              </TableCell>
              <TableCell>
                {torrent.files.length}{` `}
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
        <div className={classnames(classes.torrentMediaWrapper, !showVideo && classes.displayNone)}>
          {/* showLoading && // might use this later for when the video is loading
            <LinearProgress
              classes={{
                colorPrimary: classes.linearColorPrimary,
                barColorPrimary: classes.linearBarColorPrimary,
              }}
            />
          */}
          <video controls ref={this.videoRef} className={classes.torrentMedia} />

          <Tooltip title={<HelpText />} placement='top-end'>
            <div className={classes.statusWrapper}>
              <Typography align="left" variant='caption' gutterBottom>
                <span className={classes.statusItem}>Progress: {status.progress}</span>
                {` `}
                <span className={classes.statusItem}>Download speed: {status.downloadSpeed}</span>
                {` `}
                <span className={classes.statusItem}>Upload speed: {status.uploadSpeed}</span>
                {` `}
                <span className={classes.statusItem}>ETA: {status.remaining}</span>
              </Typography>
              <Typography className={classes.helpTextWrapper} align="right" variant='caption' gutterBottom>
                <a href="https://subby.io/encode" target="_blank">Video not loading?</a>
              </Typography>
            </div>
          </Tooltip>
        </div>

      </div>
    )
  }
}

const msToTime = (duration) => {
  const milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24)

  let time = ''

  if (hours) {
    time += hours + 'h'
  }

  if (minutes) {
    time += minutes + 'm'
  }

  time += seconds + 's'

  return time
}

const HelpText = () => 
  <div>
    <p>
      Only the following codecs can be streamed in the browser
      <ul>
        <li>vp8</li>
        <li>vorbis</li>
        <li>avc1.4d001e</li>
        <li>avc1.42001e</li>
        <li>mp4a.40.2</li>
        <li>mp4a.40.5</li>
        <li>mp4a.67</li>
      </ul>
      Video needs to download enough pieces to start streaming
    </p>
  </div>

export default withStyles(styles)(Torrent) // eslint-disable-line
