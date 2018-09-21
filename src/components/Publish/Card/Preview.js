import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Post from '../../../containers/Post'

const previewStyles = theme => ({
  preview: {
    '& > div': {
      marginTop: 0,
      marginBottom: theme.spacing.unit * 3,
      boxShadow: `0 0 0px 5px ${theme.palette.grey['100']}`,
      backgroundColor: theme.palette.background.default,
      boxShadow: 'none',
      padding: 0,
      animation: 'fadeIn ease 1s'
    }
  }
})

let Preview = (props) => 
  <div className={props.classes.preview}>
    <Post post={props.post} preview onPreviewClose={props.cancelPreview} />
  </div>

export default withStyles(previewStyles)(Preview)