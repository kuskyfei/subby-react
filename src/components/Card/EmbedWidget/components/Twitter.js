import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import {LoadingJs} from './util'
const {addScript} = require('./util')

const styles = theme => ({
  twitter: {
  	'& twitter-widget': {
    	width: '100%!important;'
		}
  }
})

class Twitter extends React.Component {
	constructor(props) {
    super(props)
    this.twitterRef = React.createRef()
  }

  componentDidMount() {
  	this.fixShadowDomWidth()
  	addScript('https://platform.twitter.com/widgets.js')
  }

  fixShadowDomWidth = () => {
  	const {classes} = this.props

		// first listen to the wrapper being changed
		const twitterWidgetObserver = new MutationObserver(([mutation]) => {
			const twitterWidget = mutation.addedNodes[0]
			if (!twitterWidget || twitterWidget.tagName !== 'TWITTER-WIDGET') {
				return
			}
			twitterWidgetObserver.disconnect()

			// second listen to the shadow root element being changed
			const shadowRootObserver = new MutationObserver(([mutation]) => {
				const embeddedTweet = mutation.addedNodes[0]
				if (!embeddedTweet || embeddedTweet.classList[0] !== 'EmbeddedTweet') {
					return
				}

				// apply css modification
				embeddedTweet.style.maxWidth = '100%'
				shadowRootObserver.disconnect()
			})

			// start listening
			const shadowRoot = twitterWidget.shadowRoot
			shadowRootObserver.observe(shadowRoot, {childList: true, subtree: true})
		})

		// start listening
		const nodeToObserve = this.twitterRef.current
		twitterWidgetObserver.observe(nodeToObserve, {childList: true, subtree: true})
	}

  render() {
  	const {classes, url} = this.props

    return (
    	<div ref={this.twitterRef} className={classes.twitter}>
    		<blockquote className='twitter-tweet'>
	      	<a href={url} />
	      	<LoadingJs />
   			</blockquote>
   		</div>
    )
  }
}

export default withStyles(styles)(Twitter) // eslint-disable-line
