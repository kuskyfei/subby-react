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

import {Preview, PublishButton, HelpText} from './components'
import {Modal} from '../../components'
import {Post} from '../../containers'
import styles from './styles'

const {fileToTypedArray, clearDataTransfer, isMagnet, isIpfsHash} = require('./util')
const debug = require('debug')('containers:Publish')
const services = require('../../services')

class Publish extends React.Component {
  state = {
    isDragging: false,
    isPreviewing: false,
    comment: '',
    link: null
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

    if (file.type === 'application/x-bittorrent') {
      await this.handleTorrentFile(file)
    }

    else {
      await this.handleIpfsFile(file)
    }

    clearDataTransfer(dataTransfer)
    debug('handleLinkDrop end')
  }

  handleTorrentFile = async (file) => {
    const magnet = await services.getMagnetFromTorrentFile(file)
    this.setState({...this.state, isDragging: false, isPreviewing: true, link: magnet})
    debug('handleTorrentFile', magnet)
  }

  handleIpfsFile = async (file) => {
    const typedArray = await fileToTypedArray(file)
    const res = await services.ipfs.uploadTypedArray(typedArray)
    const ipfsHash = res[0].hash

    this.setState({...this.state, isDragging: false, isPreviewing: true, link: `ipfs:${ipfsHash}`})
  }

  handleLinkPaste = (e) => {
    const pastedValue = e.clipboardData.getData('text/plain')
    debug('handleLinkPaste', pastedValue)

    let link = pastedValue.trim()

    if (isMagnet(link)) {
      link = services.prepareMagnetForEthereum(link)
    }

    if (isIpfsHash(link)) {
      link = 'ipfs:' + link
    }

    this.setState({...this.state, isPreviewing: true, link: link})
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

    const post = {
      thumbnail: profile && profile.thumbnail,
      comment,
      link,
      username: (profile && profile.username) || address,
      address,
      id: 0
    }

    return (
      <Modal trigger={<PublishButton />}>

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

      </Modal>
    )
  }
}

const dangerouslySetUploadMessage = 'Drop an image, torrent or paste a link'

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
