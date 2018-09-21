import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import EditIcon from '@material-ui/icons/Edit'

const styles = theme => ({
  profile: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6
    },
    textAlign: 'center'
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
  iconSmall: {
    fontSize: 16,
    opacity: 0.5
  },
  button: {
    margin: theme.spacing.unit
  },

  editAvatar: {
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 0 0 2px rgba(189, 189, 189, 0.40)'
    }
  }
})

const Profile = (props) => {
  const {classes, profile} = props

  if (!profile.username) profile.username = profile.address

  return (
    <div className={classes.profile}>

      <Avatar
        className={classNames(classes.avatar, classes.bigAvatar, classes.editAvatar)}
      >
        <AddAPhotoIcon />
      </Avatar>

      <Typography className={classes.username} variant='title' noWrap gutterBottom>
        {profile.username}
      </Typography>

      <Button size='small' variant='contained' color='default' className={classes.button}>
        Subscribe&nbsp;
        <span className={classes.count}>{profile.subscriberCount || ''}</span>
      </Button>
      <Button size='small' variant='contained' color='default' className={classes.button}>
        Edit&nbsp;
        <EditIcon className={classes.iconSmall} />
      </Button>

      <Typography className={classes.bio} variant='body1' gutterBottom>
        {profile.bio}
      </Typography>
    </div>
  )
}

export default withStyles(styles)(Profile)
