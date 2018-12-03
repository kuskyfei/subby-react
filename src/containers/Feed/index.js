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
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  bottomError: {
    paddingTop: 0,
    paddingBottom: 32,
    [theme.breakpoints.down(600 + theme.spacing.unit * 3 * 2)]: {
      paddingBottom: 12
    },
  }
})

class Feed extends React.Component {
  state = {
    hasMorePosts: true,
    addingMorePosts: false,
    publisherStartAt: 0,
    isInitializing: false,
    settings: {},
    subscriptions: null,
    walletDisconnected: false,
    profileIsLoading: false
  }

  componentDidMount() {
    ;(async () => {
      this.setState(state => ({isInitializing: true}))
      const settings = await services.getSettings()
      this.setState(state => ({settings, isInitializing: false}))
    })()

    this.addPostsToFeed({reset: true})
    this.handleProfile({reset: true})

    debug('mounted')
  }

  componentDidUpdate(prevProps) {
    this.handleRouteChange(prevProps)
    this.handleProfileChange(prevProps)

    debug('updated')
  }

  componentWillUnmount() {
    debug('unmounted')
  }

  handleProfile = async ({reset} = {}) => {
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

  async addPostsToFeed({reset, ignoreCache} = {}) {
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

    route: if (isPermalink(location.search)) {
      this.setState(state => ({hasMorePosts: false, addingMorePosts: true}))
      const id = getPostIdFromUrlParams(location.search)
      let post = await services.getPostFromId({publisher: username, id})
      if (post.address === '0x0000000000000000000000000000000000000000') {
        break route
      }
      post.link = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F'
      // post.link = `magnet:?xt=urn:btih:02767050e0be2fd4db9a2ad6c12416ac806ed6ed&dn=tears_of_steel_1080p.webm&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io`
      // post.link = 'magnet:?xt=urn:btih:a56d309c2a248e96c2bfc2596300c1f3cbb4f034&dn=cat-sleeping.webm&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com'
      // post.link = 'magnet:?xt=urn:btih:4cc28dd535a485d228007f2b3dfccd3a6e92331b&dn=ping+pongs&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com'
      // post.link = `magnet:?xt=urn:btih:20ee80ca6540dc6fbd99cdb87d235b8b786e0131&dn=You_are_fluent_in_this_language_(and_don't_even_kn%5BV005550364%5D.mp4&tr=dht%3A%2F%2F20EE80CA6540DC6FBD99CDB87D235B8B786E0131.dht%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fdownload.ted.com%2Ftalks%2FChristophNiemann_2018-480p.mp4%3Fapikey%3D172BB350-0206`
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
      if (!address) {
        this.setState(state => ({walletDisconnected: true}))
        break route
      }
      const res = await services.getPostsFromPublisher(address, {limit: 10, startAt: publisherStartAt})
      const {posts, nextStartAt, hasMorePosts} = res
      actions.setFeed([...feed, ...posts])
      this.setState(state => ({publisherStartAt: nextStartAt, hasMorePosts, addingMorePosts: true}))
    }

    else if (isFeed(location.search)) {
      const limit = 10
      const startAt = feed.length
      const subscriptions = await services.getSubscriptions()
      const subscriptionsArray = Object.keys(subscriptions)
      const cleanSubscriptionsArray = removeBlacklisted(subscriptionsArray)

      this.setState(state => ({subscriptions: subscriptionsArray, addingMorePosts: true}))
      const newPosts = await services.getFeed({subscriptions: cleanSubscriptionsArray, startAt, limit, ignoreCache})
      actions.setFeed([...feed, ...newPosts])
      if (newPosts.length < limit) {
        this.setState(state => ({hasMorePosts: false}))
      }
    }

    this.setState(state => ({addingMorePosts: false}))
    debug('addPostsToFeed end', this.props, this.state)
  }

  render() {
    const {classes, feed, location} = this.props
    const {addingMorePosts, profileIsLoading, settings, isInitializing, subscriptions, walletDisconnected, hasMorePosts} = this.state
    const accountFromUrlParams = getAccountFromUrlParams(location.search)
    const feedError = this.getFeedError()
    const postsError = this.getPostsError()

    // wait for init
    if (isInitializing) {
      return <div />
    }

    // handle most errors
    if (feedError) {
      return <ErrorMessage error={feedError} username={accountFromUrlParams} subscriptions={subscriptions} onRefresh={this.addPostsToFeed.bind(this, {reset: true, ignoreCache: true})} />
    }

    // fill the feed with posts
    let posts = []
    for (const post of feed) {
      if (post) {
        posts.push(<Post key={post.username + post.address + post.id} post={post} settings={settings} />)
      }
    }
    if (profileIsLoading) {
      posts = []
    }
    if (postsError === 'profileHttpPostsDisabled') {
      posts = []
    }

    // fill profile
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

        {profile && <Profile isLoading={profileIsLoading} profile={profile} editable={editable} />}

        <FeedComponent postCount={posts.length} addPostsToFeed={this.addPostsToFeed.bind(this)} >
          {posts}
          {addingMorePosts && <Post isLoading />}
        </FeedComponent>

        {postsError && 
          <ErrorMessage className={classes.bottomError} error={postsError} username={accountFromUrlParams} subscriptions={subscriptions} onRefresh={this.addPostsToFeed.bind(this, {reset: true, ignoreCache: true})} />
        }

      </div>
    )
  }

  handleRouteChange(prevProps) {
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

  handleProfileChange = (prevProps) => {
    const {location, profile} = this.props
    const {address} = profile || {}
    const {profile: prevProfile} = prevProps || {}
    const {address: prevAddress} = prevProfile || {}

    debug('handleProfileChange', {prevProfile, profile})

    if (!prevProps) {
      return
    }
    if (!isProfile(location.search)) {
      return
    }
    if (prevAddress === address) {
      return
    }

    this.addPostsToFeed({reset: true})
    debug('handleProfileChange end')
  }

  getFeedError = () => {
    const {feed, publisherProfile, profile, location} = this.props
    const {addingMorePosts, profileIsLoading, settings, subscriptions, walletDisconnected} = this.state
    const accountFromUrlParams = getAccountFromUrlParams(location.search)
    const postsAreEnabled = services.utils.postsAreEnabled()

    debug('feed error', {addingMorePosts, profileIsLoading, postsAreEnabled, subscriptions, publisherProfile, profile, walletDisconnected})

    if (addingMorePosts) {
      return
    }
    if (profileIsLoading) {
      return
    }
    if (isProfile(location.search) && window.location.protocol === 'file:' && !window.web3) {
      return 'fileProtocol'
    }
    if (isProfile(location.search) && walletDisconnected) {
      return 'notConnected'
    }
    if (isFeed(location.search) && feed && feed.length === 0 && postsAreEnabled) {
      return 'noPosts'
    }
    if (publisherProfile && publisherProfile.isTerminated) {
      return 'isTerminated'
    }
    if (isProfile(location.search) && profile && profile.isTerminated) {
      return 'profileTerminated'
    }
    if (publisherProfile && publisherProfile.address === '0x0000000000000000000000000000000000000000' && accountFromUrlParams && accountFromUrlParams.length < 40) {
      return 'unregisteredUsername'
    }
    if (publisherProfile && publisherProfile.address === '0x0000000000000000000000000000000000000000') {
      return 'invalidUsername'
    }
    if (isFeed(location.search) && !postsAreEnabled) {
      return 'feedHttpPostsDisabled'
    }
  }

  getPostsError = () => {
    const {location, publisherProfile} = this.props
    const {settings, hasMorePosts, addingMorePosts, profileIsLoading} = this.state
    const accountFromUrlParams = getAccountFromUrlParams(location.search)
    const feedError = this.getFeedError()
    const postsAreEnabled = services.utils.postsAreEnabled()
    const isBlacklisted = services.utils.isBlacklisted(accountFromUrlParams, publisherProfile && publisherProfile.address, publisherProfile && publisherProfile.username)

    debug('posts error', {feedError, addingMorePosts, postsAreEnabled, isBlacklisted, publisherProfile, hasMorePosts})

    if (feedError) {
      return
    }
    if (addingMorePosts) {
      return
    }
    if (profileIsLoading) {
      return
    }
    if (!isProfile(location.search) && !postsAreEnabled) {
      return 'profileHttpPostsDisabled'
    }
    if (isPublisher(location.search) && isBlacklisted) {
      return 'profileHttpPostsDisabled'
    }
    if (isFeed(location.search) && !hasMorePosts) {
      return 'noMorePosts'
    }
  }
}

const removeBlacklisted = (subscriptions) => {
  const cleanSubscriptions = services.utils.removeBlacklisted(subscriptions)
  if (cleanSubscriptions.length !== subscriptions.length) {
    window.dispatchEvent(new CustomEvent('snackbar', {detail: {type: 'somePostsUnavailable'}}))
  } 

  return cleanSubscriptions
}

const getProfile = async (account) => {
  const profile = await services.getProfile(account)
  const isSubscribed = await services.isSubscribed(profile)
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
