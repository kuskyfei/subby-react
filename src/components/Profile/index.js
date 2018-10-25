import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography'
import MessageIcon from '@material-ui/icons/Message'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import EditIcon from '@material-ui/icons/Edit'

import {Modal, Donate} from '../../components'
import EditForm from './EditForm'
import Loading from './Loading'

const styles = theme => ({
  profile: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6
    },
    textAlign: 'center',
    animation: 'fadeIn ease 1s'
  },
  username: {
    margin: theme.spacing.unit
  },
  bio: {
    margin: theme.spacing.unit
  },
  avatar: {
    margin: 'auto',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  bigAvatar: {
    width: 70,
    height: 70
  },
  count: {
    opacity: 0.5
  },
  leftNudge: {
    transform: 'translateX(-1px)'
  },
  iconSmall: {
    fontSize: 16,
    opacity: 0.5
  },
  button: {
    margin: theme.spacing.unit,
    '& > span': {
      transform: 'translateX(1px)'
    }
  },
  contents: {
    display: 'contents'
  }
})

class Profile extends React.Component {
  state = {isSubscribed: null}

  async handleSubscribe () {
    const {services, profile} = this.props
    if (!services) {
      return
    }
    const account = profile.username || profile.address

    this.setState({...this.state, isSubscribed: true})
    const address = await services.getAddress()
    await services.subscribe(account)
  }

  async handleUnsubscribe () {
    const {services, profile} = this.props
    if (!services) {
      return
    }
    this.setState({...this.state, isSubscribed: false})
    const address = await services.getAddress()
    await services.unsubscribe([profile.username, profile.address])
  }

  render () {
    const {classes, profile, editable, isLoading} = this.props
    const {isSubscribed} = this.state

    const username = profile.username || profile.address
    if (isSubscribed === true) profile.isSubscribed = true
    if (isSubscribed === false) profile.isSubscribed = false

    if (isLoading) return <Loading />

    return (
      <div className={classes.profile}>
        <Avatar
          alt={username}
          src={profile.thumbnail}
          className={classNames(classes.avatar, classes.bigAvatar)}
        >
          {username && username.substring(0, 2)}
        </Avatar>

        <Typography className={classes.username} variant='title' noWrap gutterBottom>
          {username}
        </Typography>

        {!profile.isSubscribed &&
          <Button onClick={this.handleSubscribe.bind(this)} size='small' variant='contained' color='default' className={classes.button}>
            Subscribe&nbsp;
            <PersonAddIcon className={classes.iconSmall} />
          </Button>
        }
        {profile.isSubscribed &&
          <Button onClick={this.handleUnsubscribe.bind(this)} size='small' variant='contained' color='default' className={classes.button}>
            Unsubscribe&nbsp;
          </Button>
        }

        {!editable &&
          <Modal maxWidth={400} trigger={
            <Button size='small' variant='contained' color='default' className={classes.button}>
              Donate&nbsp;
              <span className={classes.contents}>
                {profile.minimumTextDonation !== 0 &&
                  <MessageIcon className={classes.iconSmall} />
                }
                {profile.totalDonationsAmount !== 0 && 
                  <span className={classNames(classes.count, classes.leftNudge)}>&nbsp;{profile.totalDonationsAmount}</span>
                }
              </span>
            </Button>}>

            <Donate profile={profile} />

          </Modal>
        }

        {editable &&
          <Modal trigger={
            <Button size='small' variant='contained' color='default' className={classes.button}>
                Edit&nbsp;
              <EditIcon className={classes.iconSmall} />
            </Button>}>

            <EditForm profile={profile} />

          </Modal>
        }

        <Typography className={classes.bio} variant='body1' gutterBottom>
          {profile.bio}
        </Typography>
      </div>
    )
  }
}

export default withStyles(styles)(Profile)
