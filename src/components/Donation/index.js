// react
import React from 'react'
import {Link} from 'react-router-dom'

// material
import {withStyles} from '@material-ui/core/styles'
import classnames from 'classnames'
import MaterialCard from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import FavoriteIcon from '@material-ui/icons/Favorite'
import CloseIcon from '@material-ui/icons/Close'
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Tooltip from '@material-ui/core/Tooltip'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Popover from '@material-ui/core/Popover'

// components
import Loading from './Loading'

// util
const timeago = require('timeago.js')()

const MAX_TEXT_LENGTH = 280

const styles = theme => ({
  cardHeaderEllipsis: {
    '& > div:nth-of-type(2)': {
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    '& > div:nth-of-type(2) > span:nth-of-type(1)': {
      display: 'inline-block'
    }
  },

  card: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3
    },
    animation: 'fadeIn ease 0.5s'
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  actions: {
    display: 'flex'
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8
    }
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
  },
  text: {
    overflowWrap: 'break-word',
    animation: 'fadeIn ease 0.5s'
  },

  closeButton: {
    color: theme.palette.grey['300'],
    fontSize: 48
  },

  donationAmounts: {
    display: 'initial',
    verticalAlign: 'middle'
  },

  donationAmountIcon: {
    pointerEvents: 'none'
  }
})

const StyledIconButton = withStyles({
  root: {
    color: 'rgba(0, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.02)'
    }
  }
})(IconButton)

class Card extends React.Component {
  state = {
    expanded: false,
    timestamp: null,
    permalinkTooltipOpen: false,
    unsubscribeTooltipOpen: false,
    cardMenuAnchorEl: null
  }

  componentDidMount () {
    const {donation} = this.props
    this.setState({timestamp: donation.timestamp})
  }

  handleExpandClick = () => {
    this.setState(state => ({expanded: !state.expanded}))
  }

  render () {
    let {classes, isLoading, donation} = this.props
    const {} = this.state

    if (isLoading) return <LoadingCard classes={classes} />

    const username = donation.senderUsername || donation.senderAddress
    const date = timeago.format(this.state.timestamp)

    return (
      <MaterialCard className={classes.card}>

        <CardHeader
          className={classes.cardHeaderEllipsis}
          avatar={
            <Link to={'?u=' + username}>
              <Avatar src={donation.thumbnail} className={classes.avatar}>
                {username.substring(0, 2)}
              </Avatar>
            </Link>
          }
          /*action={ // might use later
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }*/
          title={<Link to={'?u=' + username}>{username}</Link>}
          subheader={<Link to={`?u=${donation.recipientAddress}&id=${donation.postId}`}>{date}</Link>}
        />

        <CardContent>
          <Typography className={classes.text} component='p'>
            {formatText(donation.text)}
          </Typography>
        </CardContent>

        <CardActions className={classes.actions} disableActionSpacing>
          <span>
            <IconButton className={classes.donationAmountIcon} aria-label='Donate'>
              <FavoriteIcon />
            </IconButton>
            <Typography className={classes.donationAmounts} variant='body1' noWrap gutterBottom>
              {donation.amount}
            </Typography>
          </span>

          {/* // might use later
          <IconButton aria-label='Share'>
            <ShareIcon />
          </IconButton>
          */}

          {isLongText(donation.text) &&
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label='Show more'
            >
              <ExpandMoreIcon />
            </IconButton>
          }
        </CardActions>

        <Collapse in={this.state.expanded} timeout='auto' unmountOnExit>
          <CardContent>
            <Typography className={classes.text} component='p'>
              {isLongText(donation.text) && donation.text}
            </Typography>
          </CardContent>
        </Collapse>

      </MaterialCard>
    )
  }
}

const isLongText = (text) => {
  return text.length > MAX_TEXT_LENGTH
}

const formatText = (text) => {
  return isLongText(text) ? text.substring(0, MAX_TEXT_LENGTH) + '...' : text
}

const LoadingCard = (props) =>

  <MaterialCard className={props.classes.card}>

    <Loading />

  </MaterialCard>

export default withStyles(styles)(Card)
