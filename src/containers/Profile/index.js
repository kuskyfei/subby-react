// react
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

// material
import withStyles from '@material-ui/core/styles/withStyles'

// components
import {Profile as ProfileComponent, Feed} from '../../components'

// actions
import actions from './reducers/actions'

// api
const services = require('../../services')

// util
const {getProfileQueryFromUrlParams, getUsernameFromUrlParams} = require('./util')
const queryString = require('query-string')
const debug = require('debug')('containers:Profile')

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

  componentDidMount () {
    this.addPostsToFeed()
    this.setProfile()

    debug('props', this.props)
    debug('mounted')
  }

  componentDidUpdate (prevProps) {
    debug('updated')
  }

  componentWillUnmount () {
    debug('unmounted')
  }

  async setProfile () {
    const {location, address, actions} = this.props

    const profileQuery = getProfileQueryFromUrlParams(location.search, address)
    const profile = await services.getProfile(profileQuery)
    actions.setProfile(profile)
  }

  async addPostsToFeed () {
    const {location, actions} = this.props

    const username = getUsernameFromUrlParams(location.search)

    const day = 1000 * 60 * 60 * 24
    const startAt = this.props.feed.length
    const postQuery = {
      subscriptions: [username],
      startAt,
      count: 5,
      beforeTimestamp: Date.now(),
      afterTimestamp: Date.now() - 180 * day
    }

    const newPosts = await services.getFeed(postQuery)

    console.log(newPosts)

    const feed = this.props.feed
    actions.setFeed([...feed, ...newPosts])

    debug('added more posts')
    debug('previous feed', feed)
    debug('new posts', newPosts)
  }

  render () {
    const {classes, feed, profile} = this.props

    const newFeed = []

    for (const post of feed) {
      if (!post) continue
      if (!profile) continue

      post.username = profile.username
      post.thumbnail = profile.thumbnail

      newFeed.push(post)
    }

    return (
      <div className={classes.layout}>

        {profile && <ProfileComponent profile={profile} />}

        <Feed feed={newFeed} addPostsToFeed={this.addPostsToFeed.bind(this)} />

      </div>
    )
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  feed: state.profile.feed,
  profile: state.profile.profile
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Profile))) // eslint-disable-line
