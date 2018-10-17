// react
import React from 'react'
import PropTypes from 'prop-types'

// material
import withStyles from '@material-ui/core/styles/withStyles'

// util
const {getPercentScrolled} = require('./util')
const debug = require('debug')('components:Feed')

const PERCERT_SCROLL_TO_ADD_MORE_POST = 50
const MINIMUM_POSTS_LEFT_TO_ADD_MORE_POST = 20

const styles = theme => ({
  feed: {

  }
})

class Feed extends React.Component {
  state = {addingMorePosts: false}

  constructor (props) {
    super(props)
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount () {
    const {addPostsToFeed} = this.props

    if (addPostsToFeed) {
      window.addEventListener('scroll', this.handleScroll)
    }

    debug('mounted')
  }

  componentDidUpdate (prevProps) {
    debug('updated')
  }

  componentWillUnmount () {
    debug('unmount')
    window.removeEventListener('scroll', this.handleScroll)
  }

  async handleScroll (event) {
    const percentScrolled = getPercentScrolled()
    const {postCount} = this.props

    if (postCount - (postCount * percentScrolled / 100) > MINIMUM_POSTS_LEFT_TO_ADD_MORE_POST) {
      debug('percent scrolled', percentScrolled, postCount - (postCount * percentScrolled / 100))
      return
    }

    if (percentScrolled > PERCERT_SCROLL_TO_ADD_MORE_POST) {
      await this.addMorePosts()

      debug('post count', postCount)
    }

    debug('percent scrolled', percentScrolled)
  }

  async addMorePosts () {
    if (this.state.addingMorePosts) {
      return
    }
    this.setState({...this.state, addingMorePosts: true})

    const {addPostsToFeed} = this.props
    await addPostsToFeed()

    this.setState({...this.state, addingMorePosts: false})
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.feed}>

        {this.props.children}

      </div>
    )
  }
}

Feed.propTypes = {
  classes: PropTypes.object.isRequired,
  postCount: PropTypes.number.isRequired
}

export default withStyles(styles)(Feed) // eslint-disable-line
