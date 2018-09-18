// react
import React from 'react'

// components
import Card from '../../components/Card'
import {Download, Torrent} from './components'

// api
const services = require('../../services')

// util
const {isIpfsContent, isTorrent, getHash, downloadBlob} = require('./util')
const debug = require('debug')('containers:Post')

class Post extends React.Component {
  state = {
    link: null,
    content: null,
    isDownloading: false
  }

  componentDidMount = () => {
    const {post, isLoading} = this.props
    if (isLoading) return

    this.handleIpfsLink()
    this.handleIpfsComment()
    this.handleTorrent()

    debug('mounted')
  }

  componentDidUpdate = (prevProps) => {
    debug('updated')
  }

  componentWillUnmount = (prevProps) => {
    if (typeof this.killStream === 'function') this.killStream()
    debug('unmount')
  }

  handleTorrent = async () => {
    const {post} = this.props
    if (!post.link) return
    if (!isTorrent(post.link)) return

    const torrent = await services.getTorrent(post.link)

    this.setState({
      ...this.state,
      link: (
        <Torrent torrent={torrent} />
      )
    })

    debug('handleTorrent end')
  }

  handleIpfsComment = async () => {
    const {post} = this.props
    if (!post.comment) return

    if (isIpfsContent(post.comment)) {
      this.setState({...this.state, comment: 'ipfs:loading'})

      const ipfsHash = getHash(post.comment)
      const string = await services.ipfs.getStringFromStream(ipfsHash, {maxLength: 10000}) // 1000 is an arbitrary small number to prevent too big IPFS files
  
      this.setState({...this.state, comment: string})
    }

    debug('handleIpfsComment end')
  }

  handleIpfsLink = async () => {
    const {post} = this.props
    if (!post.link) return

    if (isIpfsContent(post.link)) {
      this.setState({...this.state, link: 'ipfs:loading'})

      const ipfsHash = getHash(post.link)
      const fileType = await services.ipfs.getFileTypeFromHash(ipfsHash)
      const fileMimeType = fileType.mime
      const fileExtension = fileType.ext

      if (fileMimeType.match(/image/)) {
        const image = await services.ipfs.getBase64ImageFromStream(ipfsHash, (progressResponse) => {
          const {progressInMbs, killStream} = progressResponse
          this.killStream = killStream

          this.setState({...this.state, link: `ipfs:loading:${progressInMbs}`})

          if (progressInMbs > 10) {
            killStream()
            this.setState({
              ...this.state,
              link: (
                <Download 
                  download={this.download.bind(this, {ipfsHash, fileExtension})}
                  message={`File ${fileMimeType} too big.`}
                  downloadMessage='Download'
                />
              )
            })
          }
        })
        this.setState({...this.state, link: image})
      }

      else {
        this.setState({
          ...this.state, 
          link: (
            <Download 
              download={this.download.bind(this, {ipfsHash, fileExtension})}
              message={`Unsuported IPFS content ${fileMimeType}.`}
              downloadMessage='Download'
            />
          )
        })
      }
    }

    debug('handleIpfsLink end')
  }

  download = async ({ipfsHash, fileExtension}) => {
    const {isDownloading} = this.state

    if (!isDownloading) {
      this.setState({...this.state, isDownloading: true})

      const blob = await services.ipfs.getBlobFromStream(ipfsHash, (progressResponse) => {
        const {progressInMbs, killStream} = progressResponse
        this.killStream = killStream

        this.setState({
          ...this.state, 
          link: (
            <Download 
              download={this.download.bind(this, {ipfsHash, fileExtension})}
              message={`${progressInMbs}mb downloaded.`}
              downloadMessage='Cancel'
            />
          ),
        })
      })

      downloadBlob({blob, fileName: `username+postid.${fileExtension}`})

      this.setState({
        ...this.state, 
        link: (
          <Download 
            download={() => downloadBlob({blob, fileName: `username+postid.${fileExtension}`})}
            message='Download complete.'
            downloadMessage='Save'
          />
        ),
        isDownloading: false
      })

    }

    if (isDownloading) {
      this.killStream()

      this.setState({
        ...this.state, 
        link: (
          <Download 
            download={this.download.bind(this, {ipfsHash, fileExtension})}
            message={`Cancelled download.`}
            downloadMessage='Try again'
          />
        ),
        isDownloading: false
      })
    }
    
  }

  render () {
    const {isLoading, post} = this.props
    const {link, comment} = this.state

    const newPost = {...post}

    if (link) newPost.link = link
    if (comment) newPost.comment = comment

    return (
      <Card isLoading={isLoading} post={newPost} />
    )
  }
}

export default Post
