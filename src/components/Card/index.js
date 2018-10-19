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
import {Modal, Donate} from '../../components'
import EmbedWidget from './EmbedWidget'
import Loading from './Loading'
const {copyToClipboard} = require('./util')

// util
const timeago = require('timeago.js')()

const MAX_COMMENT_LENGTH = 280

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
  comment: {
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

  lightTooltip: {
    background: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 12,
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

  handleCardMenuClick = event => {
    this.setState({...this.state, cardMenuAnchorEl: event.currentTarget })
  }

  handleCardMenuClose = () => {
    this.setState({...this.state, cardMenuAnchorEl: null })
  }

  async handleUnsubscribe() {
    this.setState({...this.state, cardMenuAnchorEl: null, unsubscribeTooltipOpen: true})
    setTimeout(() => {
      this.setState({...this.state, unsubscribeTooltipOpen: false})
    }, 1500)

    const {services, post} = this.props
    if (!services) {
      return
    }
    const address = await services.getAddress()
    await services.unsubscribe({address, publishers: [post.username, post.address]})
  }

  handlePermalinkCopy() {
    const {post} = this.props
    const permalink = `https://subby.io/?u=${post.username}&id=${post.id}`

    copyToClipboard(permalink)

    this.setState({...this.state, permalinkTooltipOpen: true})

    setTimeout(() => {
      this.setState({...this.state, permalinkTooltipOpen: false})
    }, 1500)
  }

  componentDidMount () {
    const {post} = this.props
    this.setState({...this.state, timestamp: post.timestamp})
  }

  handleExpandClick = () => {
    this.setState(state => ({...state, expanded: !state.expanded}))
  }

  render () {
    let {classes, isLoading, post, preview, onPreviewClose} = this.props
    const {permalinkTooltipOpen, cardMenuAnchorEl, unsubscribeTooltipOpen} = this.state

    if (!preview) {
      onPreviewClose = () => {}
    }

    if (isLoading) return <LoadingCard classes={classes} />

    if (!post.username) post.username = post.address

    const date = (preview) ? 'Previewing...' : timeago.format(this.state.timestamp)

    return (
      <MaterialCard className={classes.card}>

        <CardHeader
          className={classes.cardHeaderEllipsis}
          avatar={
            <Link to={'?u=' + post.username}>
              <Avatar src={post.thumbnail} className={classes.avatar}>
                {post.username.substring(0, 2)}
              </Avatar>
            </Link>
          }
          action={
            preview
              ? <StyledIconButton onClick={onPreviewClose}>
                <CloseIcon className={classes.closeButton} />
              </StyledIconButton>
              : <Tooltip
                  title={`Unsubscribed from ${post.username || post.address}!`}
                  classes={{tooltip: classes.lightTooltip}}
                  open={unsubscribeTooltipOpen}
                >
                  <IconButton
                    ref={this.menuButtonRef}
                    aria-owns={cardMenuAnchorEl ? 'card-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleCardMenuClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
          }
          title={<Link to={'?u=' + post.username}>{post.username}</Link>}
          subheader={<Link to={`?u=${post.username}&id=${post.id}`}>{date}</Link>}
        />

        <Menu
          id="card-menu"
          anchorEl={cardMenuAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={Boolean(cardMenuAnchorEl)}
          onClose={this.handleCardMenuClose}
        >
          <MenuItem onClick={this.handleUnsubscribe.bind(this)}>Unsubscribe</MenuItem>
        </Menu>

        <EmbedWidget url={post.link} />

        {post.comment !== 'loading' &&
          <CardContent>
            <Typography className={classes.comment} component='p'>
              {formatComment(post.comment)}
            </Typography>
          </CardContent>
        }

        {post.comment === 'loading' &&
          <EmbedWidget url='loading' />
        }

        {!preview &&
          <CardActions className={classes.actions} disableActionSpacing>

            <Modal maxWidth={400} trigger={
              <span>
                <IconButton aria-label='Donate'>
                  <FavoriteIcon />
                </IconButton>
                <Typography className={classes.donationAmounts} variant='body1' noWrap gutterBottom>
                  0.85
                </Typography>
              </span>}>

              <Donate profile={post} />
            </Modal>

            <Tooltip
              title="Permalink copied to clipboard!"
              classes={{tooltip: classes.lightTooltip}}
              open={permalinkTooltipOpen}
            >
              <IconButton onClick={this.handlePermalinkCopy.bind(this)} aria-label='Share'>
                <ShareIcon />
              </IconButton>
            </Tooltip>

            {isLongComment(post.comment) &&
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
        }

        <Collapse in={this.state.expanded} timeout='auto' unmountOnExit>
          <CardContent>
            <Typography className={classes.comment} component='p'>
              {isLongComment(post.comment) && post.comment}
            </Typography>
          </CardContent>
        </Collapse>

      </MaterialCard>
    )
  }
}

const isLongComment = (comment) => {
  return comment.length > MAX_COMMENT_LENGTH
}

const formatComment = (comment) => {
  return isLongComment(comment) ? comment.substring(0, MAX_COMMENT_LENGTH) + '...' : comment
}

const LoadingCard = (props) =>

  <MaterialCard className={props.classes.card}>

    <Loading />

  </MaterialCard>

export default withStyles(styles)(Card)
