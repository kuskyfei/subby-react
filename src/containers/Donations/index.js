/* eslint brace-style: 0 */

// react
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators, compose} from 'redux'
import {withRouter} from 'react-router-dom'

// material
import withStyles from '@material-ui/core/styles/withStyles'

// components
import {Feed as FeedComponent} from '../../components'

// containers
import {Post} from '../../containers'

// api
const services = require('../../services')

// util
const {
  getAccountFromUrlParams,
  getUsernameFromUrlParams,
  getPostIdFromUrlParams,
  isPermalink,
  isPublisher,
  isProfile,
  isFeed,
  isRouteChange,
  isProfileChange
} = require('./util')
const debug = require('debug')('containers:Donations')

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }
})

class Donations extends React.Component {
  state = {
    hasMorePosts: true,
    addingMorePosts: false,
    publisherStartAt: 0
  }

  componentDidMount () {
    ;(async () => {

    })()

    this.addPostsToFeed({reset: true})

    debug('mounted')
  }

  componentDidUpdate (prevProps) {
    debug('updated')
  }

  componentWillUnmount () {
    debug('unmounted')
  }

  async addPostsToFeed ({reset} = {}) {
    debug('addPostsToFeed start', this.props, this.state)
    let {location, actions, feed} = this.props
    let {hasMorePosts, publisherStartAt} = this.state
    const username = getUsernameFromUrlParams(location.search)

    if (!hasMorePosts) {
      return
    }

    this.setState(state => ({addingMorePosts: true}))

    const startAt = feed.length
    const address = await services.getAddress()
    const subscriptions = await services.getActiveSubscriptions(address)
    const newPosts = await services.getFeed({subscriptions, startAt, limit: 10})
    actions.setFeed([...feed, ...newPosts])

    this.setState(state => ({addingMorePosts: false}))
    debug('addPostsToFeed end', this.props, this.state)
  }

  render () {
    const {classes, feed, location} = this.props
    const {addingMorePosts, profileIsLoading, settings, isInitializing} = this.state

    if (isInitializing) {
      return <div />
    }

    const posts = []
    for (const post of feed) {
      if (post) {
        posts.push(<Post key={post.username + post.address + post.id} post={post} settings={settings}/>)
      }
    }

    let profile, editable
    if (isProfile(location.search)) {
      profile = this.props.profile
      editable = true
    }
    if (isPublisher(location.search)) {
      profile = this.props.publisherProfile
    }

    return (
      <div className={classes.layout}>
        <FeedComponent postCount={posts.length} addPostsToFeed={this.addPostsToFeed.bind(this)} >
          {posts}
          {addingMorePosts && <Post isLoading />}
        </FeedComponent>

      </div>
    )
  }
}

const enhance = compose(
  withStyles(styles)
)

export default enhance(Donations) // eslint-disable-line
