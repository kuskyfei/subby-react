// react
import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

// material
import withStyles from '@material-ui/core/styles/withStyles'

// components
import {ProfileHeader} from '../../components'

// containers
import Post from '../Post'

// api
const services = require('../../services')

// util
const queryString = require('query-string')
const {isValidAddress} = require('../util')
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
      const {u} = queryString.parse(this.props.location.search)
      const profileQuery = isValidAddress(u) ? {address: u} : {username: u}
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
      link: 'ipfs:QmeeogFMkaWi3n1hurdMXLuAHjG2tSaYfFXvXqP6SPd1zo', // image
      // link: 'ipfs:QmPrg9qm6RPpRTPF9cxHcYBtQKHjjytYEriU37PQpKeJTV', // video
      // link: 'ipfs:QmZbp9u6yMDW94mfxTYe8hMaomBLr2NfckUhYf3J7ax7zM/dog-loves-baby.mp4',
      // link: 'ipfs:QmQ747r7eLfsVtBFBSRwfXsPK6tADJpQzJxz4uFdoZb9XJ', // big video
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
