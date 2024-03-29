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
import CircularProgress from '@material-ui/core/CircularProgress'

import {Preview, PublishButton, HelpText} from './components'
import {Modal} from '../../components'
import {Post} from '../../containers'
import styles from './styles'

const {fileToTypedArray, clearDataTransfer, isMagnet, isIpfsHash, formatBytes} = require('./util')
const debug = require('debug')('containers:Publish')
const services = require('../../services')
const {settings} = require('../../settings')

class Publish extends React.Component {
  state = {
    isDragging: false,
    isPreviewing: false,
    comment: '',
    link: null,
    errorMessage: null,
    settings: null,
    publishButtonIsLoading: false
  }

  constructor (props) {
    super(props)
    this.handleGlobalClipboardPasting = this.handleGlobalClipboardPasting.bind(this)
  }

  componentDidMount = () => {
    this.addGlobalClipboardPastingListener()
  }

  componentDidUpdate = (prevProps) => {
  }

  componentWillUnmount = () => {
    this.removeGlobalClipboardPastingListener()
  }

  addGlobalClipboardPastingListener = () => {
    document.querySelector('body').addEventListener('paste', this.handleGlobalClipboardPasting)
  }

  removeGlobalClipboardPastingListener = () => {
    document.querySelector('body').removeEventListener('paste', this.handleGlobalClipboardPasting)
  }

  handleLinkDragEnter = (e) => {
    e.preventDefault()
    this.setState({isDragging: true})
  }

  handleLinkDragOver = (e) => {
    e.preventDefault()
  }

  handleLinkDragLeave = (e) => {
    e.stopPropagation()
    e.preventDefault()
    this.setState({isDragging: false})
  }

  handleLinkDrop = async (e) => {
    debug('handleLinkDrop')
    e.preventDefault()

    this.setState({isDragging: false, isPreviewing: true, link: 'loading:Uploading'})

    const {dataTransfer} = e
    const file = dataTransfer.items[0].getAsFile()

    if (file.type === 'application/x-bittorrent') {
      await this.handleTorrentFile(file)
    } else {
      await this.handleIpfsFile(file)
    }

    clearDataTransfer(dataTransfer)
    debug('handleLinkDrop end')
  }

  handleTorrentFile = async (file) => {
    const magnet = await services.getMagnetFromTorrentFile(file)
    const settings = await services.getSettings()
    this.setState({isDragging: false, isPreviewing: true, link: magnet, settings})
    debug('handleTorrentFile', magnet)
  }

  handleIpfsFile = async (file) => {
    const typedArray = await fileToTypedArray(file)
    const ipfsHash = await services.ipfs.uploadTypedArray(typedArray)
    const settings = await services.getSettings()

    this.setState({isDragging: false, isPreviewing: true, link: `ipfs:${ipfsHash}`, settings})
  }

  handleLinkPaste = async (e) => {
    const pastedValue = e.clipboardData.getData('text/plain')
    debug('handleLinkPaste', pastedValue)

    let link = pastedValue.trim()

    if (isMagnet(link)) {
      link = services.prepareMagnetForEthereum(link)
    }

    if (isIpfsHash(link)) {
      link = 'ipfs:' + link
    }

    const settings = await services.getSettings()

    this.setState({isPreviewing: true, link: link, settings})
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

    this.setState({isPreviewing: false})
  }

  handleCommentChange = ({target}) => {
    this.setState({comment: target.value})
  }

  handleModalClose = () => {
    this.setState({errorMessage: null})
  }

  handlePublish = async () => {
    let {comment, link} = this.state
    const {classes, profile} = this.props
    this.setState({errorMessage: null})

    // handle errors
    if (window.location.protocol === 'file:' && !window.web3) {
      this.setState({errorMessage: <Typography variant="body1">MetaMask does not allow <strong>file://</strong> protocol, use <strong>http(s)://</strong></Typography>})
      return
    }
    if (!comment && !link) {
      this.setState({errorMessage: <Typography variant="body1">Cannot publish empty posts. <a href="https://subby.io/publish">Need help?</a></Typography>})
      return
    }
    const address = await services.getAddress()
    if (!address) {
      this.setState({errorMessage: <Typography variant="body1">Wallet not connected. <a href="https://subby.io/publish">Need help?</a></Typography>})
      return
    }
    const network = await services.getNetwork()
    if (settings.ETHEREUM_NETWORK !== network) {
      this.setState({errorMessage: <Typography variant="body1">Network not set to {settings.ETHEREUM_NETWORK}. <a href="https://subby.io/publish">Need help?</a></Typography>})
      return
    }
    if (profile.isTerminated) {
      this.setState({errorMessage: <Typography variant="body1">Cannot publish from terminated account</Typography>})
      return
    }
    if (address !== profile.address) {
      this.setState({errorMessage: <Typography variant="body1">Not logged in to <strong className={classes.address}>{profile.address}</strong></Typography>})
      return
    }

    // if comment is too big, send to ipfs
    if (comment.length > 50) {
      this.setState({errorMessage: null, publishButtonIsLoading: true})
      comment = await services.ipfs.uploadString(comment)
      comment = 'ipfs:' + comment
      this.setState({errorMessage: null, publishButtonIsLoading: false})
    }

    await services.publish({comment, link})

    window.dispatchEvent(new CustomEvent('transaction', {detail: {type: 'publish'}}))
    this.setState(state => ({comment: '', link: null}))
  }

  // this is not currently used but it might be useful
  // if we need to change the link from a user's action
  handlePostChange = (post) => {
    debug('handlePostChange', {post})
    if (post.link) {
      this.setState(state => ({link: post.link,}))
    }
  }

  render () {
    const {classes, address, profile} = this.props
    const {isDragging, isPreviewing, comment, link, errorMessage, settings, publishButtonIsLoading} = this.state

    const post = {
      thumbnail: profile && profile.thumbnail,
      comment,
      link,
      username: (profile && profile.username) || address,
      address,
      id: 0
    }

    return (
      <Modal onClose={this.handleModalClose} trigger={<PublishButton />}>

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
            <Post post={post} settings={settings} preview onPostChange={this.handlePostChange} onPreviewClose={this.cancelPostPreview.bind(this)} />
          </Preview>
        }

        <TextField
          className={classes.textField}
          fullWidth
          rows={3}
          multiline
          placeholder={`Text (optional)`}
          value={comment}
          onChange={this.handleCommentChange.bind(this)}
        />

        <div className={classes.buttonsContainer}>

          <Tooltip title={<HelpText />} placement='top-start'>
            <HelpIcon className={classes.greyIcon} />
          </Tooltip>

          <span className={classes.errorMessage}>
            {errorMessage}
          </span>

          <Button
            variant='contained'
            color='default'
            className={classes.publishButton}
            onClick={this.handlePublish.bind(this)}
          >
            <span className={classes.publishButtonText}>Publish</span>
            {!publishButtonIsLoading && <CloudUploadIcon className={classes.rightIcon} />}
            {publishButtonIsLoading && <span className={classes.rightIcon}><span className={classes.publishButtonLoading}><CircularProgress className={classes.black} size={17} /></span></span>}
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
