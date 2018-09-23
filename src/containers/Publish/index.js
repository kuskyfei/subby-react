import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import classnames from 'classnames'
import {connect} from 'react-redux'
import {compose} from 'redux'

import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import HelpIcon from '@material-ui/icons/Help'
import Tooltip from '@material-ui/core/Tooltip'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import {Preview, PublishModal} from './components'
import {Post} from '../../containers'
import styles from './styles'

const {fileToTypedArray} = require('./util')
const debug = require('debug')('containers:Publish')
const services = require('../../services')

const dangerouslySetUploadMessage = 'Drop an image, torrent or paste a link'

class Publish extends React.Component {
  state = {
    isDragging: false,
    isPreviewing: false,
    comment: '',
    link: null,
  }

  componentDidMount = () => {
    this.addGlobalClipboardPastingListener()
  }

  componentWillUnmount = () => {
    this.removeGlobalClipboardPastingListener()
  }

  addGlobalClipboardPastingListener = () => {
    document.querySelector('body').addEventListener('paste', this.handleGlobalClipboardPasting.bind(this))
  }

  removeGlobalClipboardPastingListener = () => {
    document.querySelector('body').removeEventListener('paste', this.handleGlobalClipboardPasting.bind(this))
  }

  handleLinkDragEnter = (e) => {
    e.preventDefault()
    this.setState({...this.state, isDragging: true})
  }

  handleLinkDragOver = (e) => {
    e.preventDefault()
  }

  handleLinkDragLeave = (e) => {
    e.stopPropagation()
    e.preventDefault()
    this.setState({...this.state, isDragging: false})
  }

  handleLinkDrop = async (e) => {
    debug('handleLinkDrop')
    e.preventDefault()

    this.setState({...this.state, isDragging: false, isPreviewing: true, link: 'loading:Uploading'})
    
    const {dataTransfer} = e
    const file = dataTransfer.items[0].getAsFile()

    const typedArray = await fileToTypedArray(file)
    const res = await services.ipfs.uploadTypedArray(typedArray)
    const ipfsHash = res[0].hash

    this.setState({...this.state, isDragging: false, isPreviewing: true, link: `ipfs:${ipfsHash}`})
    
    clearDataTransfer(dataTransfer)
    debug('handleLinkDrop ipfs hash', ipfsHash)
  }

  handleLinkPaste = (e) => {
    const pastedValue = e.clipboardData.getData('text/plain')
    debug('handleLinkPaste', pastedValue)

    this.setState({...this.state, isPreviewing: true, link: pastedValue})
  }

  handleGlobalClipboardPasting = (e) => {
    if (e.path[0].tagName !== 'TEXTAREA') {
      this.handleLinkPaste(e)
    }
  }

  blockRegularTypingInLinkInput = ({target}) => {
    target.innerHTML = dangerouslySetUploadMessage
  }

  cancelPostPreview = () => {
    debug('cancelPostPreview')

    this.setState({...this.state, isPreviewing: false})
  }

  handleCommentChange = ({target}) => {
    this.setState({...this.state, comment: target.value})
  }

  handlePublish = () => {
    // publish using web3
    debug('handlePublish')
  }

  render () {
    const {classes, address, profile} = this.props
    const {isDragging, isPreviewing, comment, link} = this.state

    // this is a temporary post to test
    // const post = {
    //   username: 'test',
    //   address: '0x0000000000000000000000000000000000000000',
    //   // comment: 'This is dope stuff',
    //   comment: 'ipfs:QmX48d6q3YgSxZjUhoSziw47AcEuUAWN3BPfZtaNkUn6uj', // long string
    //   link: 'ipfs:QmeeogFMkaWi3n1hurdMXLuAHjG2tSaYfFXvXqP6SPd1zo', // image
    //   // link: 'ipfs:QmPrg9qm6RPpRTPF9cxHcYBtQKHjjytYEriU37PQpKeJTV', // video
    //   // link: 'ipfs:QmZbp9u6yMDW94mfxTYe8hMaomBLr2NfckUhYf3J7ax7zM/dog-loves-baby.mp4',
    //   // link: 'ipfs:QmQ747r7eLfsVtBFBSRwfXsPK6tADJpQzJxz4uFdoZb9XJ', // big video
    //   // link: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F',
    //   timestamp: Date.now()
    // }

    const post = {
      thumbnail: profile && profile.thumbnail,
      comment,
      link,
      username: profile && profile.username || address,
      address,
      id: 0
    }

    return (
      <PublishModal>
        <Card className={classes.card}>

          <CardContent>

            {!isPreviewing &&
              <Typography
                className={
                  classnames(
                    classes.upload,
                    !isDragging && classes.uploadNotDragging,
                    isDragging && classes.uploadDragging
                  )
                }
                onDragEnter={this.handleLinkDragEnter.bind(this)}
                onDragOver={this.handleLinkDragOver.bind(this)}
                onDragLeave={this.handleLinkDragLeave.bind(this)}
                onDrop={this.handleLinkDrop.bind(this)}
                onPaste={this.handleLinkPaste.bind(this)}
                contentEditable
                suppressContentEditableWarning
                variant='title'
                component='div'
                onInput={this.blockRegularTypingInLinkInput.bind(this)}
              >
                {dangerouslySetUploadMessage}
              </Typography>
            }

            {isPreviewing &&
              <Preview>
                <Post post={post} preview onPreviewClose={this.cancelPostPreview.bind(this)} />
              </Preview>
            }

            <TextField
              className={classes.textField}
              fullWidth
              rows={3}
              multiline
              placeholder={`What?`}
              value={comment}
              onChange={this.handleCommentChange.bind(this)}
            />

            <div className={classes.buttonsContainer}>

              <Tooltip title={<HelpText />} placement='top-start'>
                <HelpIcon className={classes.greyIcon} />
              </Tooltip>

              <Button
                variant='contained'
                color='default'
                className={classes.publishButton}
                onClick={this.handlePublish.bind(this)}
              >
                <span className={classes.publishButtonText}>Publish</span>
                <CloudUploadIcon className={classes.rightIcon} />
              </Button>
            </div>

          </CardContent>

        </Card>
      </PublishModal>
    )
  }
}

const clearDataTransfer = (dataTransfer) => {
  if (dataTransfer.items) {
    dataTransfer.items.clear()
  } else {
    dataTransfer.clearData()
  }
}

const HelpText = () =>
  <div>
    <p>
      Drop files: jpg, jpeg, png, gif, torrent (e.g. example.jpg)
    </p>
    <p>
      Direct links: jpg, jpeg, png, gif, webm, mp4, ogg, wav, mp3, flac (e.g. https://example.com/something.mp4)
    </p>
    <p>
      Social links: Youtube, Vimeo, Reddit, Twitter, Facebook, Instagram (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ)
    </p>
    <p>
      IPFS hashes (e.g. QmeeogFMkaWi3n1hurdMXLuAHjG2tSaYfFXvXqP6SPd1zo), torrent magnet (e.g. magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df67...)
    </p>
  </div>

Publish.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.app.profile,
  address: state.app.address
})

const enhance = compose(
  connect(mapStateToProps),
  withStyles(styles)
)

export default enhance(Publish) // eslint-disable-line
