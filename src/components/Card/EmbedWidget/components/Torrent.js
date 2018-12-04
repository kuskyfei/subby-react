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
import CloseIcon from '@material-ui/icons/Close'

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
    width: 'unset',
    transform: 'translateY(-1px)'
  },
  closeIcon: {
    fontSize: 20
  },

  stopButton: {
    height: 'unset',
    width: 'unset',
    transform: 'translateY(-3px)'
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
  },
  helpTextWrapper: {
    whiteSpace: 'nowrap',
    marginLeft: 'auto',
    paddingLeft: 8
  },
  statusItem: {
    whiteSpace: 'nowrap',
  },
  downloadFile: {
    fontWeight: 600,
    '& a:hover': {
    }
  },

  tooltip: {
    maxWidth: 200
  },
  activeFile: {
    fontWeight: 500
  }
})

class Torrent extends React.Component {
  constructor(props) {
    super(props)
    this.videoRef = React.createRef()
  }

  state = {
    // open the files by default if the torrent has streamable files
    filesOpen: this.props.url.hasStreamableFiles,
    showVideo: false,
    showLoading: true,
    status: {},
    activeTorrentFileIndex: null,
    loadingTorrentFileIndex: null,
    stopDisabled: false
  }

  handleClick () {
    this.setState({...this.state, filesOpen: !this.state.filesOpen})
  }

  componentDidMount () {
  }

  componentDidUpdate (prevProps) {
  }

  componentWillUnmount () {
    debug('unmounted')
  }

  addTorrentMedia = async (fileIndex) => {
    const {classes, url: torrent} = this.props
    const torrentDestroyed = torrent.getStatus().stopped

    if (torrentDestroyed) {
      this.setState({loadingTorrentFileIndex: fileIndex})
      await torrent.restart()
    }

    this.setState({showVideo: true, showLoading: true, activeTorrentFileIndex: fileIndex, stopDisabled: false, loadingTorrentFileIndex: null})
    torrent.addToElement(`.${classes.torrentMedia}`, fileIndex)
    this.handleTorrentElementRendered()
    this.startStatusInterval()
  }

  stopTorrent = () => {
    const {url: torrent} = this.props

    this.setState({activeTorrentFileIndex: null, stopDisabled: true})

    try {
      torrent.stop()
    }
    catch (e) {
      console.error(e)
    }
  }

  startStatusInterval = async () => {
    debug('startStatusInterval', {statusInterval: this.statusInterval})
    if (this.statusInterval) {
      clearInterval(this.statusInterval)
    }

    this.statusInterval = setInterval(() => {
      try {
        this.updateStatus()
      }
      catch (e) {
        console.error(e)
        try {
          clearInterval(this.statusInterval)
        }
        catch (e) {
          console.error(e)
        }
      }
    }, 1000)
  }

  updateStatus = () => {
    const {url: torrent} = this.props
    const status = torrent.getStatus()

    let progress = status.progress
    if (status.done) {
      progress = 1
    }
    progress = (100 * progress).toFixed(1) + '%'

    let remaining
    if (status.done) {
      remaining = '0s'
    } else {
      remaining = msToTime(status.timeRemaining)
    }

    this.setState({
      status: {
        done: status.done,
        peers: status.peerCount,
        progress,
        remaining,
        downloadSpeed: prettierBytes(status.downloadSpeed) + '/s ',
        uploadSpeed: prettierBytes(status.uploadSpeed) + '/s ',
        stopped: status.stopped
      }
    })
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
    const {showVideo, showLoading, status, activeTorrentFileIndex, loadingTorrentFileIndex, stopDisabled} = this.state

    let files = []
    const mediaFiles = []

    let counter = 0
    for (const file of torrent.files) {
      const fileIndex = counter++
      let playButton

      // send real play buttons for playable files
      if (torrent.fileIsStreamable(fileIndex)) {
        const handlePlay = () => this.addTorrentMedia(fileIndex)
        playButton = <IconButton onClick={handlePlay} className={classes.playButton}><PlayArrowIcon /></IconButton>

        let loading
        if (loadingTorrentFileIndex === fileIndex) {
          loading = <CircularProgress size={10} />
        }

        let fileClassname
        if (activeTorrentFileIndex === fileIndex) {
          fileClassname = classes.activeFile
        }

        mediaFiles.push(<p className={fileClassname} key={file}>{file} {playButton} {loading}</p>)
        continue
      }

      // if file is not a media, send invisible button
      const invisiblePlayButton = <IconButton className={classnames(classes.playButton, classes.playButtonInvisible)}><PlayArrowIcon /></IconButton>
      playButton = invisiblePlayButton
      files.push(<p key={file}>{file} {playButton}</p>)
    }

    files = [...mediaFiles, ...files]

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
                {torrent.getStatus().peerCount}
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
          <video controls ref={this.videoRef} className={classes.torrentMedia} />

            <div className={classes.statusWrapper}>
              {!status.done &&
                <IconButton disabled={stopDisabled || status.stopped} onClick={this.stopTorrent} className={classes.stopButton}><CloseIcon className={classes.closeIcon}/></IconButton>
              }
              <Typography align="left" variant='caption' gutterBottom>
                <span className={classes.statusItem}>Progress: {status.progress}</span>
                {` `}
                <span className={classes.statusItem}>Download speed: {status.downloadSpeed}</span>
                {` `}
                <span className={classes.statusItem}>Upload speed: {status.uploadSpeed}</span>
                {` `}
                <span className={classes.statusItem}>ETA: {status.remaining}</span>
                {` `}
                {status.done && 
                  <span className={classnames(classes.downloadFile, classes.statusItem)}>
                    <a onClick={() => torrent.downloadFile(activeTorrentFileIndex)}>↪Download</a>
                  </span>
                }
              </Typography>
              <Tooltip classes={{tooltip: classes.tooltip}} title={<HelpText />} placement='top-end'>
                <Typography className={classes.helpTextWrapper} align="right" variant='caption' gutterBottom>
                  <a href="https://subby.io/encode" target="_blank">Video not loading?</a>
                </Typography>
              </Tooltip>
            </div>
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

  if (time === 'NaNs') {
    time = '∞'
  }

  return time
}

const HelpText = () => 
  <div>
    <p>
      Files need to download enough pieces to start streaming.
    </p>
    <p>
      Only the following codecs can be streamed in the browser:
    </p>
    <ul>
      <li>vp8</li>
      <li>vorbis</li>
      <li>avc1.4d001e</li>
      <li>avc1.42001e</li>
      <li>mp4a.40.2</li>
      <li>mp4a.40.5</li>
      <li>mp4a.67</li>
    </ul>
  </div>

export default withStyles(styles)(Torrent) // eslint-disable-line
