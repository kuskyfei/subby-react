/* eslint-disable */

// react
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter, Link } from 'react-router-dom'
import PropTypes from 'prop-types'

// material
import withStyles from '@material-ui/core/styles/withStyles'

// components
import {Post} from '../../components'

// actions
import actions from './reducers/actions'

// api
const services = require('../../services')

const day = 1000*60*60*24

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    }
  }
})

const reddit = {
  comment: 'hey this is my comment',
  link: "https://www.reddit.com/r/mildlyinteresting/comments/9b3f7r/in_canada_because_certain_dyes_are_banned_orange/",
  username: "MyUsername",
  timestamp: "December 3rd 2018"
}

const instagram = {
  comment: 'This is my other comment!',
  link: "https://www.instagram.com/p/Bm_wQfVBu1w/",
  username: "MyUsername",
  timestamp: "December 3rd 2018"
}

const youtube = {
  comment: 'Awesome!',
  link: 'https://www.youtube.com/watch?v=EMiYqvGzvkI',
  username: "MyUsername",
  timestamp: "December 3rd 2018"
}

const vimeo = {
  comment: 'YEEEEEEE',
  link: 'https://vimeo.com/video/257056050',
  username: "MyUsername",
  timestamp: "December 3rd 2018"
}

const facebook = {
  comment: 'cool',
  link: "https://www.facebook.com/thementionlive/videos/vb.608219979558854/867753370088312/?type=2&theater",
  username: "MyUsername",
  timestamp: "December 3rd 2018"
}

const twitter = {
  comment: 'cool',
  link: "https://twitter.com/ethereum/status/1035526464135942145?ref_src=twsrc%5Etfw",
  username: "MyUsername",
  timestamp: "December 3rd 2018"
}

const image = {
  comment: 'cool',
  link: "https://i.redditmedia.com/KvKXQkAuBvZOaNAwh7bJbE4WnQELy94-7UmUR6VgPqU.jpg?fit=crop&crop=faces%2Centropy&arh=2&w=960&s=825840bdf4581af9f7d9aca36a3d29f6",
  username: "MyUsername",
  timestamp: "December 3rd 2018"
}

class Feed extends React.Component {

  componentDidMount() {

    ;(async () => {

      const postQuery = {
        subscriptions: this.props.subscriptions,
        startAt: 0,
        count: 20,
        beforeTimestamp: Date.now(),
        afterTimestamp: Date.now() - 7*day
      }

      const feed = await services.getFeed(postQuery)
      const {setFeed} = this.props.actions
      setFeed(feed)

      console.log('feed', feed)
    })()
    
  }

  render() {
    const { classes, feed } = this.props

    const posts = []
    for (const post of feed) {
      console.log(post)

      posts.push(<Post key={JSON.stringify(post)} post={post}/>)
    }

    return (
      <div className={classes.layout}>
        
        {posts}

        {/* 
        <Post post={youtube}/>
        <Post post={vimeo}/>
        <Post post={twitter}/>
        <Post post={facebook}/>
        <Post post={reddit}/>
        <Post post={instagram}/>
        */}

      </div>
    )
  }
}

Feed.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  subscriptions: state.app.subscriptions,
  feed: state.feed
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Feed))) // eslint-disable-line
