/* eslint brace-style: 0 */

// react
import React from 'react'
import {connect} from 'react-redux'
import {compose} from 'redux'
import {withRouter} from 'react-router-dom'
import Typography from '@material-ui/core/Typography'

// material
import withStyles from '@material-ui/core/styles/withStyles'

// components
import {Feed as FeedComponent, Donation} from '../../components'
import ErrorMessage from './ErrorMessage'

// api
const services = require('../../services')

// util
const debug = require('debug')('containers:Donations')

const DONATIONS_PER_PAGE = 50

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
  },
  message: {
    paddingTop: theme.spacing.unit * 4,
  }
})

class Donations extends React.Component {
  state = {
    donations: [],
  }

  donations = []

  componentDidMount () {
    this.onDonation = services.onDonation({}, (donation) => {
      this.donations.push(donation)
      this.setState({donations: this.donations})
    })

    debug('mounted')
  }

  componentDidUpdate (prevProps) {
    debug('updated')
  }

  componentWillUnmount () {
    this.onDonation.off()
    debug('unmounted')
  }

  render () {
    const {classes, address, profile} = this.props
    let {donations} = this.state

    donations = donations.slice(donations.length - DONATIONS_PER_PAGE, donations.length)

    const donationCards = []

    for (const donation of donations) {
      donationCards.push(<Donation donation={donation}/>)
    }

    if (!address) {
      return <ErrorMessage error='notConnected'/>
    }
    if (profile && profile.isTerminated) {
      return <ErrorMessage error='profileTerminated'/>
    }

    return (
      <div className={classes.layout}>
        {donationCards.length === 0 &&
          <Typography className={classes.message} variant='body1' align='center'>
            When you receive a donation, it will appear below.
          </Typography>
        }
        <FeedComponent postCount={donations.length}>
          {donationCards}
        </FeedComponent>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  address: state.app.address,
  profile: state.app.profile
})

const enhance = compose(
  connect(mapStateToProps),
  withStyles(styles)
)

export default enhance(Donations) // eslint-disable-line
