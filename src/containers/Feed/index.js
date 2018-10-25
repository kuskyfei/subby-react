/* eslint brace-style: 0 */

// react
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators, compose} from 'redux'
import {withRouter} from 'react-router-dom'

// material
import withStyles from '@material-ui/core/styles/withStyles'

// components
import {Profile, Feed as FeedComponent} from '../../components'
import {ErrorMessage} from './components'

// containers
import {Post} from '../../containers'

// actions
import actions from './reducers/actions'

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
const debug = require('debug')('containers:Feed')

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

class Feed extends React.Component {
  state = {
    hasMorePosts: true,
    addingMorePosts: false,
    publisherStartAt: 0,
    isInitializing: false,
    settings: {},
    subscriptions: null
  }

  componentDidMount () {
    ;(async () => {
      this.setState(state => ({isInitializing: true}))
      const settings = await services.getSettings()
      this.setState(state => ({settings, isInitializing: false}))
    })()

    this.addPostsToFeed({reset: true})
    this.handleProfile({reset: true})

    debug('mounted')
  }

  componentDidUpdate (prevProps) {
    this.handleRouteChange(prevProps)

    debug('updated')
  }

  componentWillUnmount () {
    debug('unmounted')
  }

  async handleProfile ({reset} = {}) {
    const {location, actions} = this.props
    debug('handleProfile start', location)

    if (reset) {
      actions.setPublisherProfile(null)
    }
    if (!isPublisher(location.search)) {
      return
    }
    if (reset) {
      this.setState(state => ({profileIsLoading: true}))
    }

    const account = getAccountFromUrlParams(location.search)
    const profile = await getProfile(account)
    actions.setPublisherProfile(profile)
    this.setState(state => ({profileIsLoading: false}))

    debug('handleProfile end', {account})
  }

  async addPostsToFeed ({reset} = {}) {
    debug('addPostsToFeed start', this.props, this.state)
    let {location, actions, feed} = this.props
    let {hasMorePosts, publisherStartAt} = this.state
    const username = getUsernameFromUrlParams(location.search)

    if (reset) {
      // need to reset when switching page
      // the state and props are set async so
      // they need to be overwritten
      actions.setFeed([])
      feed = []
      this.setState(state => ({hasMorePosts: true, publisherStartAt: 0}))
      hasMorePosts = true
      publisherStartAt = 0
    }

    if (!hasMorePosts) {
      return
    }

    this.setState(state => ({addingMorePosts: true}))

    if (isPermalink(location.search)) {
      this.setState(state => ({hasMorePosts: false, addingMorePosts: true}))
      const id = getPostIdFromUrlParams(location.search)
      let post = await services.getPostFromId({publisher: username, id})
      actions.setFeed([post])
    }

    else if (isPublisher(location.search)) {
      const res = await services.getPostsFromPublisher(username, {limit: 10, startAt: publisherStartAt})
      const {posts, nextStartAt, hasMorePosts} = res
      actions.setFeed([...feed, ...posts])
      this.setState(state => ({publisherStartAt: nextStartAt, hasMorePosts, addingMorePosts: true}))
    }

    else if (isProfile(location.search)) {
      const address = await services.getAddress()
      const res = await services.getPostsFromPublisher(address, {limit: 10, startAt: publisherStartAt})
      const {posts, nextStartAt, hasMorePosts} = res
      actions.setFeed([...feed, ...posts])
      this.setState(state => ({publisherStartAt: nextStartAt, hasMorePosts, addingMorePosts: true}))
    }

    else if (isFeed(location.search)) {
      const startAt = feed.length
      const address = await services.getAddress()
      const subscriptions = await services.getSubscriptions(address)
      const subscriptionsArray = Object.keys(subscriptions) 
      this.setState(state => ({subscriptions: subscriptionsArray, addingMorePosts: true}))
      const newPosts = await services.getFeed({subscriptions, startAt, limit: 10})
      actions.setFeed([...feed, ...newPosts])
    }

    this.setState(state => ({addingMorePosts: false}))
    debug('addPostsToFeed end', this.props, this.state)
  }

  render () {
    const {classes, feed, location} = this.props
    const {addingMorePosts, profileIsLoading, settings, isInitializing, subscriptions} = this.state

    if (isInitializing) {
      return <div />
    }

    const posts = []
    for (const post of feed) {
      if (post) {
        posts.push(<Post key={post.username + post.address + post.id} post={post} settings={settings} />)
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

    if (subscriptions && !profile && posts.length === 0) {
      return <ErrorMessage subscriptions={subscriptions} onRefresh={this.addPostsToFeed.bind(this, {reset: true})} />
    }
    if (subscriptions && subscriptions.length === 0) {
      return <ErrorMessage subscriptions={subscriptions} />
    }

    return (
      <div className={classes.layout}>

        {profile && <Profile isLoading={profileIsLoading} profile={profile} editable={editable} services={services} />}

        <FeedComponent postCount={posts.length} addPostsToFeed={this.addPostsToFeed.bind(this)} >
          {posts}
          {addingMorePosts && <Post isLoading />}
        </FeedComponent>

      </div>
    )
  }

  handleRouteChange (prevProps) {
    if (!isRouteChange(this.props, prevProps)) {
      return
    }

    this.addPostsToFeed({reset: true})

    if (!isProfileChange(this.props, prevProps)) {
      return
    }

    this.handleProfile({reset: true})

    debug('feed changed')
  }
}

const getProfile = async (account) => {
  const profile = await services.getProfile(account)
  const address = await services.getAddress()
  const isSubscribed = await services.isSubscribed({publisher: profile, address})
  profile.isSubscribed = isSubscribed
  return profile
}

const mapStateToProps = state => ({
  feed: state.feed.feed,
  publisherProfile: state.feed.publisherProfile,
  profile: state.app.profile
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

const enhance = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)

export default enhance(Feed) // eslint-disable-line
