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
      marginRight: 'auto',
    }
  }
})

class Feed extends React.Component {

  state = {addingMorePosts: false}

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this))

    ;(async () => {

      // const postQuery = {
      //   subscriptions: this.props.subscriptions,
      //   startAt: 0,
      //   count: 5,
      //   beforeTimestamp: Date.now(),
      //   afterTimestamp: Date.now() - 7*day
      // }

      // const feed = await services.getFeed(postQuery)
      // const {setFeed} = this.props.actions
      // setFeed(feed)

      await this.addMorePosts()

    })()
    
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this))
  }

  async handleScroll(event) {
    const percentScrolled = getPercentScrolled()
    const postCount = this.props.feed.length

    if (postCount / 2 > MINIMUM_POSTS_LEFT_TO_ADD_MORE_POST) {
      return
    }

    if (percentScrolled > PERCERT_SCROLL_TO_ADD_MORE_POST) {
      await this.addMorePosts()
    }
  }

  async addMorePosts() {
    console.log(getPercentScrolled())

    if (this.state.addingMorePosts) {
      return
    }
    this.setState({...this.state, addingMorePosts: true})

    console.log('addMorePosts')
    console.log(this)

    const startAt = this.props.feed.length
    const postQuery = {
      subscriptions: this.props.subscriptions,
      startAt,
      count: 5,
      beforeTimestamp: Date.now(),
      afterTimestamp: Date.now() - 7*day
    }

    const newPosts = await services.getFeed(postQuery)
    const feed = this.props.feed
    const {setFeed} = this.props.actions
    setFeed([...feed, ...newPosts])

    console.log('feed', feed)
    this.setState({...this.state, addingMorePosts: false})
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

        {this.state.addingMorePosts ? <Post loading /> : ''}

      </div>
    )
  }
}

const getPercentScrolled = () => {
  const winheight= window.innerHeight || (document.documentElement || document.body).clientHeight
  const docheight = getDocHeight()
  const scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
  const trackLength = docheight - winheight
  const pctScrolled = Math.floor(scrollTop/trackLength * 100) // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
  return pctScrolled
}

const getDocHeight = () => {
  const D = document;
  return Math.max(
    D.body.scrollHeight, D.documentElement.scrollHeight,
    D.body.offsetHeight, D.documentElement.offsetHeight,
    D.body.clientHeight, D.documentElement.clientHeight
  )
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
