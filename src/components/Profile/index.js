import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography'
import MessageIcon from '@material-ui/icons/Message'
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

const Profile = (props) => {
  const {classes, profile, editable, isLoading} = props

  if (!profile.username) profile.username = profile.address

  // not sure why this is needed, the 0 isn't being converted to null for some reason
  if (profile.minimumTextDonation === 0) profile.minimumTextDonation = null

  if (isLoading) return <Loading />

  return (
    <div className={classes.profile}>
      <Avatar
        alt={profile.username}
        src={profile.thumbnail}
        className={classNames(classes.avatar, classes.bigAvatar)}
      >
        {profile.username && profile.username.substring(0, 2)}
      </Avatar>
      <Typography className={classes.username} variant='title' noWrap gutterBottom>
        {profile.username}
      </Typography>
      <Button size='small' variant='contained' color='default' className={classes.button}>
        Subscribe&nbsp;
        <span className={classes.count}>{profile.subscriberCount || ''}</span>
      </Button>

      {!editable &&
        <Modal maxWidth={400} trigger={
          <Button size='small' variant='contained' color='default' className={classes.button}>
            Donate&nbsp;
            {profile.minimumTextDonation &&
              <span className={classes.contents}>
                <MessageIcon className={classes.iconSmall} />
                &nbsp;
                <span className={classNames(classes.count, classes.leftNudge)}>{profile.minimumTextDonation}</span>
              </span>
            }
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

export default withStyles(styles)(Profile)
