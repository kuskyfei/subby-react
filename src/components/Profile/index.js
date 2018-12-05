import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import {Link} from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography'
import MessageIcon from '@material-ui/icons/Message'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import EditIcon from '@material-ui/icons/Edit'
import GetAppIcon from '@material-ui/icons/GetApp'

import {Modal, Donate} from '../../components'
import EditForm from './EditForm'
import Loading from './Loading'

const services = require('../../services')

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

  async handleSubscribe() {
    const {profile} = this.props
    const account = profile.username || profile.address

    this.setState({...this.state, isSubscribed: true})
    await services.subscribe(account)
  }

  async handleUnsubscribe() {
    const {profile} = this.props

    this.setState({...this.state, isSubscribed: false})
    await services.unsubscribe([profile.username, profile.address])
  }

  async handleDownload() {
    const {profile} = this.props

    const username = profile.username || profile.address

    await services.utils.downloadSubby({username, fileName: username})
  }

  render () {
    const {classes, profile, editable, isLoading} = this.props
    const {isSubscribed} = this.state

    if (profile.address === '0x0000000000000000000000000000000000000000') {
      return <div />
    }

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
          <Link to={`?u=${username}`}>{username}</Link>
        </Typography>

        {!editable && 
          <div className={classes.contents}>

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

          </div>
        }

        {editable &&
          <div className={classes.contents}>

            <Button onClick={this.handleDownload.bind(this)} size='small' variant='contained' color='default' className={classes.button}>
              Download&nbsp;
              <GetAppIcon className={classes.iconSmall} />
            </Button>

            <Modal trigger={
              <Button size='small' variant='contained' color='default' className={classes.button}>
                  Edit&nbsp;
                <EditIcon className={classes.iconSmall} />
              </Button>}>

              <EditForm profile={profile} />

            </Modal>

          </div>
        }

        <Typography className={classes.bio} variant='body1' gutterBottom>
          {profile.bio}
        </Typography>
      </div>
    )
  }
}

export default withStyles(styles)(Profile)
