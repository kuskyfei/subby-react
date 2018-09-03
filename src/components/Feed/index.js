/* eslint-disable */

import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'

import Post from '../Post'

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

  render() {
    const { classes } = this.props

    return (
      <div className={classes.layout}>
        
        <Post post={image}/>

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

export default withStyles(styles)(Feed)
