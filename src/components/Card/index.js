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

const services = require('../../services')

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
    fontSize: 12
  },

  reportText: {
    padding: 8
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
    this.setState({cardMenuAnchorEl: event.currentTarget })
  }

  handleCardMenuClose = () => {
    this.setState({cardMenuAnchorEl: null })
  }

  async handleUnsubscribe () {
    this.setState({cardMenuAnchorEl: null, unsubscribeTooltipOpen: true})
    setTimeout(() => {
      this.setState({unsubscribeTooltipOpen: false})
    }, 1500)

    const {post} = this.props
    await services.unsubscribe([post.username, post.address])
  }

  handlePermalinkCopy () {
    const {post} = this.props
    const username = post.username || post.address

    const permalink = `https://subby.io/?u=${username}&id=${post.id}`

    copyToClipboard(permalink)

    this.setState({permalinkTooltipOpen: true})

    setTimeout(() => {
      this.setState({permalinkTooltipOpen: false})
    }, 1500)
  }

  componentDidMount () {
    const {post} = this.props
    this.setState({timestamp: post.timestamp})
  }

  handleExpandClick = () => {
    this.setState(state => ({expanded: !state.expanded}))
  }

  render () {
    let {classes, isLoading, post, preview, onPreviewClose, settings} = this.props
    const {permalinkTooltipOpen, cardMenuAnchorEl, unsubscribeTooltipOpen} = this.state

    if (!preview) {
      onPreviewClose = () => {}
    }

    if (isLoading) return <LoadingCard classes={classes} />

    const username = post.username || post.address || '0x0000000000000000000000000000000000000000'
    const date = (preview) ? 'Previewing...' : timeago.format(this.state.timestamp)
    let postDonationsAmount = (!post.postDonationsAmount) ? null : post.postDonationsAmount.toFixed(3)
    if (postDonationsAmount < 0.001) postDonationsAmount = null

    return (
      <MaterialCard className={classes.card}>

        <CardHeader
          className={classes.cardHeaderEllipsis}
          avatar={
            <Link to={'?u=' + username}>
              <Avatar src={post.thumbnail} className={classes.avatar}>
                {username.substring(0, 2)}
              </Avatar>
            </Link>
          }
          action={
            preview
              ? <StyledIconButton onClick={onPreviewClose}>
                <CloseIcon className={classes.closeButton} />
              </StyledIconButton>
              : <Tooltip
                title={`Unsubscribed from ${username}!`}
                classes={{tooltip: classes.lightTooltip}}
                open={unsubscribeTooltipOpen}
              >
                <IconButton
                  aria-owns={cardMenuAnchorEl ? 'card-menu' : null}
                  aria-haspopup='true'
                  onClick={this.handleCardMenuClick}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
          }
          title={<Link to={'?u=' + username}>{username}</Link>}
          subheader={<Link to={`?u=${username}&id=${post.id}`}>{date}</Link>}
        />

        <Menu
          id='card-menu'
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
          <Modal maxWidth={400} trigger={<MenuItem>Report</MenuItem>} onClose={this.handleCardMenuClose}>
            <Typography className={classes.reportText}>
              In <strong>file://</strong> protocol, Subby is decentralized and does not censor creators.
            </Typography>
            <Typography className={classes.reportText}>
              In <strong>http(s)://</strong> protocol, Subby is hosted on GitHub and must comply with their <a target="_blank" href="https://help.github.com/articles/github-community-guidelines/#what-is-not-allowed">content policy</a>. Report any infringement to <i>subbydapp@gmail.com</i>.
            </Typography>
          </Modal>
        </Menu>

        <EmbedWidget settings={settings} url={post.link} />

        {this.props.children}

        {post.comment !== 'loading' &&
          <CardContent>
            <Typography className={classes.comment} component='p'>
              {formatComment(post.comment)}
            </Typography>
          </CardContent>
        }

        {post.comment === 'loading' &&
          <EmbedWidget url='loading' settings={settings}/>
        }

        {!preview &&
          <CardActions className={classes.actions} disableActionSpacing>

            <Modal maxWidth={400} trigger={
              <span>
                <IconButton aria-label='Donate'>
                  <FavoriteIcon />
                </IconButton>

                {postDonationsAmount &&
                  <Typography className={classes.donationAmounts} variant='body1' noWrap gutterBottom>
                    {postDonationsAmount}
                  </Typography>
                }
              </span>}>

              <Donate profile={post} />
            </Modal>

            <Tooltip
              title='Permalink copied to clipboard!'
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
