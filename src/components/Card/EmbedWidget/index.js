import React from 'react'

import Facebook from './Facebook'
import Instagram from './Instagram'
import Reddit from './Reddit'
import Twitter from './Twitter'
import Vimeo from './Vimeo'
import Youtube from './Youtube'
import Image from './Image'
import Link from './Link'
import Ipfs from './Ipfs'

const {extractRootDomain} = require('./util')

const EmbedWidget = (props) => {
  const Widget = getWidgetFromUrl(props.url)

  return <Widget url={props.url} />
}

const getWidgetFromUrl = (url) => {

  if (!url) {
    return () => <div />
  }

  if (isReactElement(url)) {
    return () => url
  }

  if (isIpfs(url)) {
    return Ipfs
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
  const cleanUrl = url.replace(/\?.+$/g, '')
  if (cleanUrl.match(/\.(jpg|jpeg|png|gif)$/)) {
    return true
  }
}

const isIpfs = (url) => {
  if (url.match(/^ipfs:/)) {
    return true
  }
}

const isReactElement = (url) => {
  return typeof url === 'object' && url.props
}

export default EmbedWidget
