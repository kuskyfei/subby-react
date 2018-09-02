import React from 'react'

import Facebook from './Facebook'
import Instagram from './Instagram'
import Reddit from './Reddit'
import Twitter from './Twitter'
import Vimeo from './Vimeo'
import Youtube from './Youtube'
import Default from './Default'

const {extractRootDomain} = require('./util')

const EmbedWidget = (props) => {

  console.log('props')
  console.log(props)

  const Widget = getWidgetFromUrl(props.url)

  console.log(Widget)

  return <Widget url={props.url} />
}

const getWidgetFromUrl = (url) => {

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

export default EmbedWidget