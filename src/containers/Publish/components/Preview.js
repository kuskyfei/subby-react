import React from 'react'
import { withStyles } from '@material-ui/core/styles'

const previewStyles = theme => ({
  preview: {
    '& > div': {
      marginTop: 0,
      marginBottom: theme.spacing.unit * 3,
      backgroundColor: theme.palette.background.default,
      boxShadow: 'none',
      padding: 0,
      animation: 'fadeIn ease 1s'
    },
    '& div::before': {
      borderColor: theme.palette.background.default
    }
  }
})

let Preview = (props) =>
  <div className={props.classes.preview}>
    {props.children}
  </div>

export default withStyles(previewStyles)(Preview)
