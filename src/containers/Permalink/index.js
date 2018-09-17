// react
import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

// material
import withStyles from '@material-ui/core/styles/withStyles'

// components
import {Profile, Feed} from '../../components'

// containers
import Post from '../Post'

// api
const services = require('../../services')

// util
const queryString = require('query-string')
const {getProfileQueryFromUrlParams} = require('./util')
const debug = require('debug')('containers:Permalink')

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
  state = {
    isLoading: false,
    profile: {}
  }

  componentDidMount () {
    ;(async () => {
      const {location} = this.props
      const profileQuery = getProfileQueryFromUrlParams(location.search)
      const profile = await services.getProfile(profileQuery)

      this.setState({...this.state, profile})
    })()

    debug('props', this.props)
    debug('mounted')
  }

  componentDidUpdate (prevProps) {
    debug('updated')
  }

  componentWillUnmount = (prevProps) => {
    debug('unmount')
  }

  render () {
    const { classes } = this.props
    const { isLoading, profile } = this.state

    const {id} = queryString.parse(this.props.location.search)

    const post = {
      username: 'test',
      address: '0x0000000000000000000000000000000000000000',
      //comment: 'This is dope stuff',
      comment: 'ipfs:QmX48d6q3YgSxZjUhoSziw47AcEuUAWN3BPfZtaNkUn6uj', // long string
      // link: 'ipfs:QmeeogFMkaWi3n1hurdMXLuAHjG2tSaYfFXvXqP6SPd1zo', // image
      // link: 'ipfs:QmPrg9qm6RPpRTPF9cxHcYBtQKHjjytYEriU37PQpKeJTV', // video
      // link: 'ipfs:QmZbp9u6yMDW94mfxTYe8hMaomBLr2NfckUhYf3J7ax7zM/dog-loves-baby.mp4',
      // link: 'ipfs:QmQ747r7eLfsVtBFBSRwfXsPK6tADJpQzJxz4uFdoZb9XJ', // big video
      link: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F',
      timestamp: Date.now()
    }

    return (
      <div className={classes.layout}>

        {profile && <ProfileHeader profile={profile} />}

        <Post key={id} post={post} />

        {isLoading && <Post loading />}

      </div>
    )
  }
}

Permalink.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRouter(withStyles(styles)(Permalink)) // eslint-disable-line
