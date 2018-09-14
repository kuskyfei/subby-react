// react
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

// material
import withStyles from '@material-ui/core/styles/withStyles'

// components
import {Post, ProfileHeader} from '../../components'

// actions
import actions from './reducers/actions'

// api
const services = require('../../services')

// util
const {getPercentScrolled} = require('./util')
const {isValidAddress} = require('../util')
const queryString = require('query-string')
const debug = require('debug')('containers:Profile')

const day = 1000 * 60 * 60 * 24
const PERCERT_SCROLL_TO_ADD_MORE_POST = 50
const MINIMUM_POSTS_LEFT_TO_ADD_MORE_POST = 20

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

class Profile extends React.Component {
  state = {
    addingMorePosts: false,
    profile: {},
    feed: []
  }

  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll.bind(this))

    ;(async () => {
      await this.addMorePosts()
    })()

    ;(async () => {
      console.log(this.props)
      console.log(this.props.location)

      const {u} = queryString.parse(this.props.location.search)
      const profileQuery = isValidAddress(u) ? {address: u} : {username: u}
      const profile = await services.getProfile(profileQuery)

      console.log(profile)

      this.setState({...this.state, profile})
    })()

    debug('props', this.props)
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

    const {u} = queryString.parse(this.props.location.search)
    const address = isValidAddress(u) ? u : null
    const username = isValidAddress(u) ? null : u

    const startAt = this.state.feed.length
    const postQuery = {
      userSubscriptions: [address],
      addressSubscriptions: [username],
      startAt,
      count: 5,
      beforeTimestamp: Date.now(),
      afterTimestamp: Date.now() - 7 * day
    }

    const newPosts = await services.getPosts(postQuery)
    const feed = [...this.state.feed, ...newPosts]
    this.setState({...this.state, feed})

    this.setState({...this.state, addingMorePosts: false})

    debug('added more posts')
    debug('previous feed', feed)
    debug('new posts', newPosts)
  }

  render () {
    const {classes} = this.props
    const {profile, addingMorePosts, feed} = this.state

    const posts = []
    for (const post of feed) {
      if (!post) continue

      post.username = profile.username
      post.address = profile.address
      post.thumbnail = profile.thumbnail
      posts.push(<Post key={JSON.stringify(post)} post={post} />)
    }

    return (
      <div className={classes.layout}>

        {profile && <ProfileHeader profile={profile} />}

        {posts}

        {addingMorePosts && <Post loading />}

      </div>
    )
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  subscriptions: state.app.subscriptions,
  feed: state.feed
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Profile))) // eslint-disable-line
