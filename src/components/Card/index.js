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
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'

// components
import EmbedWidget from './EmbedWidget'
import Loading from './Loading'

// util
const timeago = require('timeago.js')()

const MAX_COMMENT_LENGTH = 280

const styles = theme => ({

  // this is to make the username have ellipsis when too long
  cardHeader: {
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
    }
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
  }
})

class Card extends React.Component {
  state = {
    expanded: false,
    timestamp: null
  }

  commentDidMount() {
    const {post} = this.props

    this.setState({...this.state, timestamp: post.timestamp})
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }))
  }

  render () {
    const {classes, isLoading, post} = this.props

    if (isLoading) return <LoadingCard classes={classes} />

    if (!post.username) post.username = post.address

    return (
      <MaterialCard className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Link to={'?u=' + post.username}>
              <Avatar src={post.thumbnail} className={classes.avatar}>
                {post.username.substring(0, 2)}
              </Avatar>
            </Link>
          }
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={<Link to={'?u=' + post.username}>{post.username}</Link>}
          subheader={<Link to={`?u=${post.username}&id=${post.id}`}>{timeago.format(this.state.timestamp)}</Link>}
        />

        <EmbedWidget url={post.link} />

        <CardContent>
          <Typography className={classes.comment} component='p'>
            {formatComment(post.comment)}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label='Add to favorites'>
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label='Share'>
            <ShareIcon />
          </IconButton>

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
