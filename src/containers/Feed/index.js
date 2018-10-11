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

// containers
import {Post} from '../../containers'

// actions
import actions from './reducers/actions'

// api
const services = require('../../services')

// util
const {
  getProfileQueryFromUrlParams,
  getUsernameFromUrlParams,
  // getPostIdFromUrlParams,
  isPermalink,
  isPublisher,
  isProfile,
  isFeed,
  isRouteChange
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
    addingMorePosts: false
  }

  componentWillMount () {
    debug('componentWillMount')
  }

  componentDidMount () {
    this.addPostsToFeed({reset: true})
    this.handleProfile({reset: true})
    debug('props', this.props)
    debug('mounted')
  }

  handleRouteChange (prevProps) {
    if (!isRouteChange(this.props, prevProps)) {
      return
    }

    this.addPostsToFeed({reset: true})
    this.handleProfile({reset: true})

    debug('feed changed')
  }

  componentDidUpdate (prevProps) {
    this.handleRouteChange(prevProps)
    debug('updated')
  }

  componentWillUnmount () {
    debug('unmounted')
  }

  async handleProfile ({reset} = {}) {
    const {location, address, actions} = this.props
    debug('handleProfile start', location)

    if (reset) actions.setPublisherProfile(null)

    if (!isPublisher(location.search)) return

    if (reset) this.setState((state, props) => ({...state, profileIsLoading: true}))
    const profileQuery = getProfileQueryFromUrlParams(location.search, address)
    const profile = await services.getProfile(profileQuery)
    actions.setPublisherProfile(profile)
    setTimeout(() => {
      this.setState((state, props) => ({...state, profileIsLoading: false}))
    }, 5000)

    debug('handleProfile end', profileQuery)
  }

  async addPostsToFeed ({reset} = {}) {
    debug('addPostsToFeed start', this.props, this.state)
    let {location, actions, feed, subscriptions, address} = this.props
    let {hasMorePosts} = this.state
    const username = getUsernameFromUrlParams(location.search)

    // need to reset when switching page
    // the state and props are set async so
    // they need to be overwritten
    if (reset) {
      actions.setFeed([])
      feed = []
      this.setState((state, props) => ({...state, hasMorePosts: true}))
      hasMorePosts = true
    }

    if (!hasMorePosts) return
    this.setState((state, props) => ({...state, addingMorePosts: true}))

    if (isPermalink(location.search)) {
      this.setState((state, props) => ({...state, hasMorePosts: false}))

      // this is a temporary post to test
      const post = {
        username: 'test',
        address: '0x0000000000000000000000000000000000000000',
        // comment: 'This is dope stuff',
        comment: 'ipfs:QmX48d6q3YgSxZjUhoSziw47AcEuUAWN3BPfZtaNkUn6uj', // long string
        // link: 'ipfs:QmeeogFMkaWi3n1hurdMXLuAHjG2tSaYfFXvXqP6SPd1zo', // image
        // link: 'ipfs:QmPrg9qm6RPpRTPF9cxHcYBtQKHjjytYEriU37PQpKeJTV', // video
        // link: 'ipfs:QmZbp9u6yMDW94mfxTYe8hMaomBLr2NfckUhYf3J7ax7zM/dog-loves-baby.mp4',
        // link: 'ipfs:QmQ747r7eLfsVtBFBSRwfXsPK6tADJpQzJxz4uFdoZb9XJ', // big video
        link: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F',
        // link: 'https://interactive-examples.mdn.mozilla.net/media/examples/stream_of_water.webm',
        // link: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
        // link: 'http://www.hochmuth.com/mp3/Haydn_Cello_Concerto_D-1.mp3',
        // link: 'https://twitter.com/APompliano/status/1034115384360792064',
        // link: 'https://www.reddit.com/r/pics/comments/9b1epu/my_husband_started_17th_grade_his_masters_program/',
        // link: 'https://www.instagram.com/p/Bm1WJFoHqif/',
        // link: 'https://vimeo.com/154583964',
        // link: 'https://www.youtube.com/watch?v=pIbAXzEHjBI',
        // link: 'https://www.facebook.com/refinery29/posts/10156965764817922',

        timestamp: Date.now(),
        id: 4
      }

      actions.setFeed([post])
    }

    else if (isPublisher(location.search)) {
      // this is a temporary query to test
      const day = 1000 * 60 * 60 * 24
      const startAt = feed.length
      const postQuery = {
        subscriptions: {[username]: username},
        startAt,
        count: 5,
        beforeTimestamp: Date.now(),
        afterTimestamp: Date.now() - 180 * day
      }

      const newPosts = await services.getFeed(postQuery)
      actions.setFeed([...feed, ...newPosts])
    }

    else if (isProfile(location.search)) {
      // this is a temporary query to test
      const day = 1000 * 60 * 60 * 24
      const startAt = feed.length
      const postQuery = {
        subscriptions: {[address]: address},
        startAt,
        count: 5,
        beforeTimestamp: Date.now(),
        afterTimestamp: Date.now() - 180 * day
      }

      const newPosts = await services.getFeed(postQuery)
      actions.setFeed([...feed, ...newPosts])
    }

    else if (isFeed(location.search)) {
      // this is a temporary query to test
      const day = 1000 * 60 * 60 * 24
      const startAt = feed.length
      const postQuery = {
        subscriptions,
        startAt,
        count: 5,
        beforeTimestamp: Date.now(),
        afterTimestamp: Date.now() - 7 * day
      }

      const newPosts = await services.getFeed(postQuery)
      actions.setFeed([...feed, ...newPosts])
    }

    this.setState((state, props) => ({...state, addingMorePosts: false}))
    debug('addPostsToFeed end', this.props, this.state)
  }

  render () {
    const {classes, feed, location} = this.props
    const {addingMorePosts, profileIsLoading} = this.state

    const posts = []
    for (const post of feed) {
      if (post) {
        posts.push(<Post key={post.username + post.address + post.id} post={post} />)
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

        {profile && <Profile isLoading={profileIsLoading} profile={profile} editable={editable} />}

        <FeedComponent postCount={posts.length} addPostsToFeed={this.addPostsToFeed.bind(this)} >
          {posts}
          {addingMorePosts && <Post isLoading />}
        </FeedComponent>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  feed: state.feed.feed,
  publisherProfile: state.feed.publisherProfile,
  address: state.app.address,
  profile: state.app.profile,
  subscriptions: state.app.subscriptions
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
