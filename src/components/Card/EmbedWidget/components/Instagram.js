import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import {LoadingJs} from './util'

const {addScript} = require('./util')

const styles = theme => ({
  instagram: {
  	'& .instagram-media': {
		  marginBlockStart: '0!important',
		  marginBlockEnd: '0!important',
		  marginInlineStart: '0!important',
		  marginInlineEnd: '0!important'
		}
  }
})

// there is a known bug with instagram that posts
// lower down the page don't load properly
class Instagram extends React.Component {
  componentDidMount() {
  	addScript('https://www.instagram.com/embed.js')
  }

  render() {
  	const {classes, url} = this.props

    return (
    	<div className={classes.instagram}>
    		<blockquote style={{width: '100%'}} className='instagram-media' data-instgrm-captioned data-instgrm-permalink={url}>
    			<LoadingJs />
    		</blockquote>
   		</div>
    )
  }
}

export default withStyles(styles)(Instagram) // eslint-disable-line
