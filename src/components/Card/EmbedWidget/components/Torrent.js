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
    maxHeight: 200,
    overflow: 'scroll'
  },
  nameCell: {
    width: '30%'
  },
  table: {
    animation: 'fadeIn ease 1.5s'
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
    }
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
})

class Torrent extends React.Component {
  constructor(props) {
    super(props)
    this.videoRef = React.createRef()
  }

  state = {
    filesOpen: false,
    showVideo: false,
    showLoading: true
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

    this.setState({showVideo: true, showLoading: true})
    torrent.addToElement(`.${classes.torrentMedia}`, fileIndex)
    this.handleTorrentElementRendered()
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
    const {showVideo, showLoading} = this.state

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
            <Typography align="right" variant='caption' gutterBottom>
              {showLoading && <CircularProgress className={classes.progress} size={10} />}
              {` `}
              <a href="https://subby.io/encode" target="_blank">Video not loading?</a>
            </Typography>
          </Tooltip>
        </div>

      </div>
    )
  }
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
      Video may take a minute to start streaming <div style={{display: 'inline-block', transform: 'translate(2px, 2px)'}}><CircularProgress style={{color: 'white'}} size={10} /></div>
    </p>
  </div>

export default withStyles(styles)(Torrent) // eslint-disable-line
