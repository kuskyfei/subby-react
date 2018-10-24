/* eslint brace-style: 0 */

// react
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators, compose} from 'redux'
import {withRouter} from 'react-router-dom'

// material
import withStyles from '@material-ui/core/styles/withStyles'

// components
import {Feed as FeedComponent, Donation} from '../../components'

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
  }
})

class Donations extends React.Component {
  state = {
    donations: []
  }

  donations = []

  componentDidMount () {
    ;(async () => {
      this.onDonation = services.onDonation({}, (donation) => {
        this.donations.push(donation)
        this.setState({donations: this.donations})
      })
    })()

    debug('mounted')
  }

  componentDidUpdate (prevProps) {
    debug('updated')
  }

  componentWillUnmount () {
    debug('unmounted')
  }

  render () {
    const {classes} = this.props
    let {donations} = this.state

    donations = donations.slice(donations.length - DONATIONS_PER_PAGE, donations.length)

    const donationCards = []

    for (const donation of donations) {
      donationCards.push(<Donation donation={donation}/>)
    }

    return (
      <div className={classes.layout}>
        <FeedComponent postCount={donations.length}>
          {donationCards}
        </FeedComponent>

      </div>
    )
  }
}

const enhance = compose(
  withStyles(styles)
)

export default enhance(Donations) // eslint-disable-line
