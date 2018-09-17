// react
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

// material
import withStyles from '@material-ui/core/styles/withStyles'

// components
import {Feed as FeedComponent} from '../../components'

// actions
import actions from './reducers/actions'

// api
const services = require('../../services')

// util
const debug = require('debug')('components:Feed')

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
  
  componentDidMount () {

    ;(async () => {
      await this.addPostsToFeed()
    })()

    debug('props', this.props)
    debug('mounted')
  }

  componentDidUpdate (prevProps) {
    debug('updated')
  }

  componentWillUnmount () {
    debug('unmounted')
  }

  async addPostsToFeed () {
    const day = 1000 * 60 * 60 * 24

    const startAt = this.props.feed.length
    const postQuery = {
      subscriptions: this.props.subscriptions,
      startAt,
      count: 5,
      beforeTimestamp: Date.now(),
      afterTimestamp: Date.now() - 7 * day
    }

    const newPosts = await services.getFeed(postQuery)
    const feed = this.props.feed
    const {setFeed} = this.props.actions
    setFeed([...feed, ...newPosts])

    debug('added more posts')
    debug('previous feed', feed)
    debug('new posts', newPosts)
  }

  render () {
    const { classes, feed } = this.props

    return (
      <div className={classes.layout}>

        <FeedComponent feed={feed} addPostsToFeed={this.addPostsToFeed.bind(this)} />

      </div>
    )
  }
}

Feed.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  subscriptions: state.app.subscriptions,
  feed: state.feed
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Feed))) // eslint-disable-line
