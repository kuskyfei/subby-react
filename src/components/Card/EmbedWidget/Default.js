import React from 'react'

const Default = (props) => {

  const url = formatUrl(props.url)

  return (
    <a target="_blank" href={url}>{props.url}</a>
  )
}

const formatUrl = (url) => {
  if (!url.match(/^http/)) {
    url = 'http://' + url
  }
  return url
}

export default Default
