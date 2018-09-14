// react
import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

// material
import withStyles from '@material-ui/core/styles/withStyles'

// components
import {Post, ProfileHeader} from '../../components'

// api
const services = require('../../services')

// util
const debug = require('debug')('containers:Permalink')

const day = 1000 * 60 * 60 * 24

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

class Permalink extends React.Component {
  state = {addingMorePosts: false}

  componentDidMount () {
    ;(async () => {
      await this.addMorePosts()
    })()

    debug('props', this.props)
    debug('mounted')
  }

  componentDidUpdate (prevProps) {
    debug('updated')
  }

  async addMorePosts () {
    if (this.state.addingMorePosts) {
      return
    }
    this.setState({...this.state, addingMorePosts: true})

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

    this.setState({...this.state, addingMorePosts: false})

    debug('added more posts')
    debug('previous feed', feed)
    debug('new posts', newPosts)
  }

  render () {
    const { classes, feed } = this.props

    const posts = []
    for (const post of feed) {
      posts.push(<Post key={JSON.stringify(post)} post={post} />)
    }

    return (
      <div className={classes.layout}>

        <ProfileHeader />

        {posts}

        {this.state.addingMorePosts ? <Post loading /> : ''}

      </div>
    )
  }
}

Permalink.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRouter(withStyles(styles)(Permalink)) // eslint-disable-line
