// react
import React from 'react'

// components
import {Card} from '../../components'

// api
const services = require('../../services')

// util
const {isIpfsContent, isTorrent, getHash, downloadBlob} = require('./util')
const debug = require('debug')('containers:Post')

const IPFS_COMMENT_MAX_LENGTH = 10000 // arbitrary small number to prevent too big IPFS files

class Post extends React.Component {
  state = {
    link: null,
    content: null,
    isDownloading: false
  }

  componentDidMount = () => {
    const {isLoading} = this.props
    if (isLoading) return

    this.handleIpfsLink()
    this.handleIpfsComment()
    this.handleTorrent()

    debug('mounted')
  }

  componentDidUpdate = (prevProps) => {
    const prevPost = (prevProps && prevProps.post) || {}
    const post = (this.props && this.props.post) || {}

    if (prevPost.link !== post.link) {
      this.handleIpfsLink()
      this.handleTorrent()
    }
    debug('updated')
  }

  componentWillUnmount = (prevProps) => {
    if (typeof this.killStream === 'function') this.killStream()
    debug('unmount')
  }

  handleTorrent = async () => {
    const settings = await services.getSettings()
    const {post} = this.props
    if (!post.link) return
    if (!isTorrent(post.link)) return
    if (!settings.WEB_TORRENT_EMBEDS) return

    const torrent = await services.getTorrent(post.link)

    this.setState({
      ...this.state,
      link: torrent
    })

    debug('handleTorrent end')
  }

  handleIpfsComment = async () => {
    const {post} = this.props
    if (!post.comment) return

    if (isIpfsContent(post.comment)) {
      this.setState({...this.state, comment: 'loading'})

      const ipfsHash = getHash(post.comment)
      const string = await services.ipfs.getStringFromStream(ipfsHash, {maxLength: IPFS_COMMENT_MAX_LENGTH})

      this.setState({...this.state, comment: string})
    }

    debug('handleIpfsComment end')
  }

  handleIpfsLink = async () => {
    const {post} = this.props
    if (!post.link) return

    if (isIpfsContent(post.link)) {
      this.setState({...this.state, link: 'loading'})

      const ipfsHash = getHash(post.link)
      const fileType = await services.ipfs.getFileTypeFromHash(ipfsHash)
      const fileMimeType = fileType ? fileType.mime : 'unknown'
      const fileExtension = fileType ? `.${fileType.ext}` : ''

      if (fileMimeType.match(/image/)) {
        const image = await services.ipfs.getBase64ImageFromStream(ipfsHash, (progressResponse) => {
          const {progressInMbs, killStream} = progressResponse
          this.killStream = killStream

          this.setState({...this.state, link: 'loading'})

          if (progressInMbs > 10) {
            killStream()
            this.setState({
              ...this.state,
              link: {
                download: this.download.bind(this, {ipfsHash, fileExtension}),
                message: `File type ${fileMimeType} too big to embed.`,
                downloadMessage: 'Download'
              }
            })
          }
        })
        this.setState({...this.state, link: image})
      } else {
        this.setState({
          ...this.state,
          link: {
            download: this.download.bind(this, {ipfsHash, fileExtension}),
            message: `Cannot embed file type ${fileMimeType}.`,
            downloadMessage: 'Download'
          }
        })
      }
    }

    debug('handleIpfsLink end')
  }

  getBlobFromStream = async ({ipfsHash, fileExtension}) => {
    this.setState({
      ...this.state,
      link: {
        download: this.download.bind(this, {ipfsHash, fileExtension}),
        message: 'Connecting.',
        downloadMessage: 'Cancel'
      },
      isDownloading: true
    })

    const blob = await services.ipfs.getBlobFromStream(ipfsHash, (progress) => {
      this.killStream = progress.killStream
      this.setState({
        ...this.state,
        link: {
          download: this.download.bind(this, {ipfsHash, fileExtension}),
          message: `${progress.progressInMbs} MB downloaded.`,
          downloadMessage: 'Cancel'
        },
        isDownloading: true
      })
    })

    return blob
  }

  getBlobFromWebWorker = ({ipfsHash, fileExtension}) => new Promise(resolve => {
    this.setState({
      ...this.state,
      link: {
        download: this.download.bind(this, {ipfsHash, fileExtension}),
        message: 'Connecting.',
        downloadMessage: 'Cancel'
      },
      isDownloading: true
    })

    const getBlobFromStream = new services.ipfs.webWorkers.GetBlobFromStream()
    this.killStream = () => getBlobFromStream.postMessage({killStream: true})
    getBlobFromStream.postMessage({
      ipfsHash,
      ipfsProvider: window.SUBBY_GLOBAL_SETTINGS.IPFS_PROVIDER
    })
    getBlobFromStream.onmessage = ({data}) => {
      if (data.progressInMbs) {
        this.setState({
          ...this.state,
          link: {
            download: this.download.bind(this, {ipfsHash, fileExtension}),
            message: `${data.progressInMbs} MB downloaded.`,
            downloadMessage: 'Cancel'
          },
          isDownloading: true
        })
      }
      if (data.blob) {
        resolve(data.blob)
      }
    }
  })

  download = async ({ipfsHash, fileExtension}) => {
    const {isDownloading} = this.state
    debug('isDownloading', isDownloading)
    const {post} = this.props
    const username = post.username || post.address
    const postId = post.id

    if (!isDownloading) {
      this.setState({...this.state, isDownloading: true})

      const blob = await this.getBlobFromStream({ipfsHash, fileExtension})

      downloadBlob({blob, fileName: `${username}-${postId}${fileExtension}`})

      this.setState({
        ...this.state,
        link: {
          download: () => downloadBlob({blob, fileName: `${username}-${postId}${fileExtension}`}),
          message: 'Download complete.',
          downloadMessage: 'Save'
        },
        isDownloading: false
      })
    }

    if (isDownloading) {
      this.killStream()

      this.setState({
        ...this.state,
        link: {
          download: this.download.bind(this, {ipfsHash, fileExtension}),
          message: 'Cancelled download.',
          downloadMessage: 'Try again'
        },
        isDownloading: false
      })
    }
  }

  render () {
    const {isLoading, post, preview, onPreviewClose, settings} = this.props
    const {link, comment} = this.state

    const newPost = {...post}

    if (link) newPost.link = link
    if (comment) newPost.comment = comment

    // catch loading IPFS content on first render
    if (isIpfsContent(newPost.link)) newPost.link = 'loading'
    if (isIpfsContent(newPost.comment)) newPost.comment = 'loading'

    return (
      <Card settings={settings} isLoading={isLoading} post={newPost} preview={preview} onPreviewClose={onPreviewClose} />
    )
  }
}

export default Post
