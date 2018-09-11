import React from 'react'
import {Link} from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'

const styles = theme => ({
  profile: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    paddingBottom: 0,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3,
      paddingBottom: 0
    },
    textAlign: 'center'
  },
  avatar: {
    margin: 'auto',
  },
  bigAvatar: {
    width: 60,
    height: 60,
  },
})

const Profile = (props) => {

  const {classes} = props

  return (
    <div className={classes.profile}>
      <Avatar
        alt="Adelle Charles"
        src="/static/images/uxceo-128.jpg"
        className={classNames(classes.avatar, classes.bigAvatar)}
      />
      <h3 className="{classes.title}">Christian Louboutin</h3>
      <h6>DESIGNER</h6>
      <p>
        An artist of considerable range, Chet Faker — the name taken
        by Melbourne-raised, Brooklyn-based Nick Murphy — writes,
        performs and records all of his own music, giving it a warm,
        intimate feel with a solid groove structure.{" "}
      </p>
    </div>
  )
}

export default withStyles(styles)(Profile)
