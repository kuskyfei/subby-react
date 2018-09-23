import React from 'react'

import {
  Facebook, Instagram,
  Reddit, Twitter,
  Vimeo, Youtube,
  Image, Link,
  Ipfs, Torrent,
  Audio, Video,
  Loading, Magnet,
  Download
} from './components'

const {extractRootDomain, stripUrlQuery} = require('./util')

const EmbedWidget = (props) => {
  const Widget = getWidgetFromUrl(props.url)

  return <Widget url={props.url} />
}

const getWidgetFromUrl = (url) => {
  if (!url) {
    return () => <div />
  }

  if (isDownload(url)) {
    return Download
  }

  if (isTorrent(url)) {
    return Torrent
  }

  if (isReactElement(url)) {
    return () => url
  }

  if (isLoading(url)) {
    return Loading
  }

  if (isIpfs(url)) {
    return Ipfs
  }

  if (isMagnet(url)) {
    return Magnet
  }

  if (isVideo(url)) {
    return Video
  }

  if (isAudio(url)) {
    return Audio
  }

  if (isImage(url)) {
    return Image
  }

  const type = getWidgetTypeFromUrl(url)

  switch (type) {
    case 'facebook':
      return Facebook

    case 'instagram':
      return Instagram

    case 'reddit':
      return Reddit

    case 'twitter':
      return Twitter

    case 'vimeo':
      return Vimeo

    case 'youtube':
      return Youtube

    default:
      return Link
  }
}

const getWidgetTypeFromUrl = (url) => {
  const domain = extractRootDomain(url)
  const type = domain.split('.')[0]
  return type
}

const isImage = (url) => {
  // this is a base64 encoded image
  if (url.match(/^data:image/)) {
    return true
  }

  // this is a link to a normal external image
  const cleanUrl = stripUrlQuery(url)
  if (cleanUrl.match(/\.(jpg|jpeg|png|gif)$/)) {
    return true
  }
}

const isVideo = (url) => {
  const cleanUrl = stripUrlQuery(url)
  if (cleanUrl.match(/\.(webm|mp4|ogg)$/)) {
    return true
  }
}

const isAudio = (url) => {
  const cleanUrl = stripUrlQuery(url)
  if (cleanUrl.match(/\.(wav|mp3|flac)$/)) {
    return true
  }
}

const isIpfs = (url) => {
  if (url.match(/^ipfs:/)) {
    return true
  }
}

const isMagnet = (url) => {
  if (url.match(/^magnet:/)) {
    return true
  }
}

const isLoading = (url) => {
  if (url.match(/^loading:/) || url.match(/^loading$/)) {
    return true
  }
}

const isTorrent = (url) => {
  return typeof url === 'object' && url.magnet
}

const isDownload = (url) => {
  return typeof url === 'object' && url.download
}

const isReactElement = (url) => {
  return typeof url === 'object' && url.props
}

export default EmbedWidget
