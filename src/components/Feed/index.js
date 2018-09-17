// react
import React from 'react'
import PropTypes from 'prop-types'

// material
import withStyles from '@material-ui/core/styles/withStyles'

// containers
import {Post} from '../../containers'

// util
const {getPercentScrolled} = require('./util')
const debug = require('debug')('components:Feed')

const PERCERT_SCROLL_TO_ADD_MORE_POST = 50
const MINIMUM_POSTS_LEFT_TO_ADD_MORE_POST = 20

const styles = theme => ({

})

class Feed extends React.Component {
  state = {addingMorePosts: false}

  componentDidMount () {
    const {addPostsToFeed} = this.props

    if (addPostsToFeed) {
      window.addEventListener('scroll', this.handleScroll.bind(this))
    }

    debug('mounted')
  }

  componentDidUpdate (prevProps) {
    debug('updated')
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll.bind(this))
  }

  async handleScroll (event) {
    const percentScrolled = getPercentScrolled()
    const postCount = this.props.feed.length

    if (postCount / 2 > MINIMUM_POSTS_LEFT_TO_ADD_MORE_POST) {
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
    const { classes, feed } = this.props
    const { addingMorePosts } = this.state

    const isLoading = addingMorePosts || !feed.length

    const posts = []
    for (const post of feed) {
      posts.push(<Post key={JSON.stringify(post)} post={post} />)
    }

    return (
      <div>

        {posts}

        {isLoading && <Post isLoading />}

      </div>
    )
  }
}

Feed.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Feed) // eslint-disable-line
