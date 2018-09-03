import React from 'react'

import Facebook from './Facebook'
import Instagram from './Instagram'
import Reddit from './Reddit'
import Twitter from './Twitter'
import Vimeo from './Vimeo'
import Youtube from './Youtube'
import Image from './Image'
import Default from './Default'

const {extractRootDomain} = require('./util')

const EmbedWidget = (props) => {
  const Widget = getWidgetFromUrl(props.url)

  return <Widget url={props.url} />
}

const getWidgetFromUrl = (url) => {
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
      return Default
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

export default EmbedWidget
